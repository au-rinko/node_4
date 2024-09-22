const express = require('express');
const fs = require('fs');
const { getTop250Movies, writeToFile, TOP_250 } = require('./fetchData');
const { moviesArray, readAll } = require('./routes/readall');
const { read } = require('./routes/read');
const { createMovie } = require('./routes/create');
const { updateMovie } = require('./routes/update');
const { deleteMovie } = require('./routes/delete');
const { registerUser, usersArray, checkUser } = require('./authorisationRoutes/register');
const { logIn } = require('./authorisationRoutes/login');

const app = express();

if (moviesArray.length === 0) {
  getTop250Movies(TOP_250);
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hi there!');
});

app.use('/api/films/readall', readAll);
app.use('/api/films/read', read);
app.use('/api/films/create', createMovie);
app.use('/api/films/update', updateMovie);
app.use('/api/films/delete', deleteMovie);
app.use('/api/auth/register', registerUser);
app.use('/api/auth/login', logIn);

app.use((req, res) => {
  res.status(404);
  res.send('Page not found');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});