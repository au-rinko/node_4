const express = require('express');
const fs = require('fs');
const { moviesArray, readAll } = require('./readall');
const { checkInformation, correctPosition } = require('../check');

const read = express.Router();

read.get('/:id', (req, res) => {
    const { params: { id }} = req;
    const result = moviesArray.filter(item => item.id == id);
 
    if (result.length === 0) {
        res.status(400);
        res.send('There is no movie with such id');
    } else {
        res.status(200);
        res.json(result);
    }
});

module.exports = {
    read
}