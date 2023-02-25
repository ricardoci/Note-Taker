
const express = require('express');
const app = express();
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

const PORT =  3001;


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
  fs.readFile(__dirname + '/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while reading the notes');
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });

});
app.post('/api/notes', (req, res) => {
  const newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text,
  };

  fs.readFile(__dirname + '/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred while reading the notes');
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(__dirname + '/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('An error occurred while saving the note');
      }

      res.json(newNote);
    });
  });
});


// Start the server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
