const { randomUUID } = require('crypto');
const express = require('express');
const path = require('path');
const { readAndAppend, writeToFile, readFromFile } = require('./assets/fsUtils');


const PORT = process.env.PORT || 3001;

const app = express();

//Middleware for parsing JSON strings and form data.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//GET route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//GET route for API style notes information
app.get('/api/notes', (req, res) =>
    readFromFile('./db/db.json').then((data) =>
    res.json(JSON.parse(data))
));

app.post('/api/notes', (req, res) =>{
    console.log('A post request has been recieved 😨')

    const { title, text } = req.body;

    const note = {
        title,
        text,
        id: randomUUID(),
    };

    readAndAppend(note, './db/db.json');
    res.json(note);

});

app.delete('/api/notes/:id', (req, res) =>{
    const noteId = req.params.id
    console.log(`You console logged ${noteId}`);
    readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((note) => note.id !== noteId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
})

//GET route for main page
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
  console.log(`Note taker is live at http://localhost:${PORT} 🔌📫`)
);
