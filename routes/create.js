const express = require('express');
const fs = require('fs');
let { moviesArray, readAll } = require('./readall');
const { getTop250Movies, writeToFile, TOP_250 } = require('../fetchData');
const { checkInformation, correctPosition } = require('../check');

const createMovie = express.Router();

createMovie.post('/', (req, res) => {
    const { body } = req;

    if (!body.name || !body.rating || !body.year || !body.budget || !body.gross || !body.poster || !body.position) {
        res.status(400);
        res.send('Not enough information');
    }

    const message = checkInformation(body);

    if (message) {
        res.status(400);
        res.send(message);
    } else {
        const newMovie = {
            id: generateId(),
            name: body.name,
            rating: body.rating,
            year: body.year,
            budget: body.budget,
            gross: body.gross,
            poster: body.poster,
            position: body.position
        }

        correctPosition(body, newMovie);

        writeToFile(moviesArray, './movies.json');

        res.status(201);
        res.json(newMovie);
    }
});

function generateId() {
    let flag = true;
    let random = null;

    while (flag) {
        random = Math.floor(Math.random() * 1000000);
        const result = moviesArray.filter(item => item.id == random);
        if (result.length === 0) {
            flag = false;
        }
    }

    return random;
}

module.exports = {
    createMovie
}