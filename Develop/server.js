const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");



// Middleware for parsing JSON
const PORT = process.env.port || 3001;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());


// Route for notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"))
})



app.get("/api/notes", (req, res) => {
  fs.readFile( "./db/db.json", "utf8", (err, data) => {
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post("/api/notes", (req, res) => {
  // Create a new note object with the given ID and the properties from the request body
  const title = req.body.title 
    const text = req.body.text 
    const newNote = {title, text, id:uuidv4()}

  // Read the existing notes from the db.json file
  fs.readFile("./db/db.json",  (err, data) => {
    // Parse the existing notes into an array
    const notes = JSON.parse(data);

    // Add the new note to the array of existing notes
    notes.push(newNote);

    // Write the updated notes array back to the db.json file
    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
      // Return the new note to the client
      res.json(newNote);
      // console.log('newNote:', newNote);
      // console.log('notes:', notes);
    });
    res.sendFile(path.join(__dirname, "/public/notes.html"))
  });
});
// Route for index.html (catch-all route)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
})
// Start the server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
