const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const PORT =  3001;

// Middleware for parsing JSON
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Route for notes.html
app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/public/notes.html');
});

// Route for index.html (catch-all route)


app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/notes', (req, res) => {
  fs.readFile(__dirname + 'db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while reading the notes #1');
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });

});


app.post('/api/notes', (req, res) => {
  // Create a new note object with the given ID and the properties from the request body
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text
  };

  // Read the existing notes from the db.json file
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while reading the notes#2');
    }

    // Parse the existing notes into an array
    const notes = JSON.parse(data);

    // Add the new note to the array of existing notes
    notes.push(newNote);

    // Write the updated notes array back to the db.json file
    fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('An error occurred while saving the note#3');
      }

      // Return the new note to the client
      res.json(newNote);
    });
  });
});

// Start the server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
