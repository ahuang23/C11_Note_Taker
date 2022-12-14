// Import Express module
const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid4 = require('uuid4');



let notes = [];
try {
   notes = JSON.parse(fs.readFileSync('./db/db.json'));
} catch (err){
   console.error("Bad file, resetting db")
};

// console.log(notes);



// Define ports
const PORT = process.env.PORT || 3001;

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// Routes


app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', function(req,res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


// GET Notes
app.get('/api/notes', (req, res) => {
    res.json(notes);    
});

// POST Notes
app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    const uuid = uuid4();

    newNote.id = uuid;
    notes.push(newNote);
    console.log(notes);
    
    updateDb();

    return res.json(newNote);

})

// DELETE Notes
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    let found = false;
    for (i=0; i < notes.length; i++) {
        if (notes[i].id === id) {
            notes.splice(i,1);
            updateDb();
            found = true;
            break
        } 
    }

    if (!found) {
        res.status(404).send('Not Found');
    } else {
        res.json(req.params.id)
    };
})

// Write File
function updateDb() {
    fs.writeFile("db/db.json",JSON.stringify(notes, null, 2), (err) => err ? console.log(err) : console.log('Success!'));
}

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

