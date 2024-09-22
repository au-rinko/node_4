const express = require('express');
const fs = require('fs');
let { moviesArray, readAll } = require('./readall');
const { getTop250Movies, writeToFile, TOP_250 } = require('../fetchData');
const { checkInformation, correctPosition } = require('../check');

const updateMovie = express.Router();

updateMovie.put('/:id', (req, res) => {
    if (req.user && req.user.super) {
        const { body, params: { id } } = req;
    
        if (!body.name && !body.rating && !body.year && !body.budget && !body.gross && !body.poster && !body.position) {
            res.status(400);
            res.send('Not enough information');
        }
    
        const message = checkInformation(body);
    
        console.log(id);
        
        if (message) {
            res.status(400);
            res.send(message);
        } else {
            const indexForUpdate = moviesArray.findIndex(item => item.id == id);
            if (indexForUpdate === -1) {
                res.status(400);
                res.send('Check the request id');
            } else {
                let itemForUpdate = moviesArray.filter(item => item.id == id);
                itemForUpdate = itemForUpdate.map(item => {
                    return {
                        id: item.id,
                        name: body.name || item.name,
                        rating: body.rating || item.rating,
                        year: body.year || item.year,
                        budget: body.budget || item.budget,
                        gross: body.gross || item.gross,
                        poster: body.poster || item.poster,
                        position: body.position || item.position
                    }
                });
        
                if (body.position) {
                    moviesArray.splice(indexForUpdate, 1);
                    correctPosition(body, itemForUpdate);
                } else {
                    moviesArray = moviesArray.map(item => item.id != id ? item : itemForUpdate);
                }
            
                writeToFile(moviesArray, './movies.json');
            
                res.status(200);
                res.json(itemForUpdate);
            }
        }
    } else {
        res.status(403);
        res.send('Only admins can update movies');
    }
});

module.exports = {
    updateMovie
}