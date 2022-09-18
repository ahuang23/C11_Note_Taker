// Import Express module
const express = require('express');
const fs = require('fs');
const path = require('path');

// Define ports
const PORT = process.env.PORT || 3001;

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Return to Index if search is undefined
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

const { notes } = require('./db/db.json')

app.get('/api/notes', (req, res) => {
    res.json(notes);    
});

app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    notes.push(newNote);
    updateDb();
    console.info('New note added')
})

function updateDb() {
    fs.writeFile("db/db.json",JSON.stringify({notes}, null, 2), (err) => err ? console.log(err) : console.log('Success!'));
}

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

