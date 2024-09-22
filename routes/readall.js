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
    res.json(moviesArray);
});

module.exports = {
    moviesArray,
    readAll
}