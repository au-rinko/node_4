const express = require('express');
const fs = require('fs');
const path = require('path');
const { getTop250Movies, writeToFile, TOP_250 } = require('../fetchData');

let moviesArray = [];

try{
    const jsonData = fs.readFileSync(path.join(__dirname, '../movies.json'), 'utf8');
    moviesArray = JSON.parse(jsonData);
} catch {
    console.log('There is no data');
    getTop250Movies(TOP_250);
}

const readAll = express.Router();

readAll.get('/', (req, res) => {
    if (req.user) {
        res.status(200);
        res.json(moviesArray);
    } else {
        res.status(403);
        res.send('If you want to see movie list you need to log in');
    }
});

module.exports = {
    moviesArray,
    readAll
}