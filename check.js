const express = require('express');
const fs = require('fs');
const { moviesArray, readAll } = require('./routes/readall');

function checkUserInfo(body) {
    let message = null;

    if (!body.email) message = 'Email is required';

    if (!body.password) message = 'Password id required';

    if (typeof body.email !== 'string' || !body.email.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/)) {
        message = 'Email should be in such format: exapmle@domain.com';
    }

    if (typeof body.password !== 'string') message = 'Password should be a string';

    return message;
}

function checkInformation (body, id) {
    let message = null;

    if (body.name && typeof body.name !== 'string') {
        message = 'Name should be a string';
    }
    
    if (body.year && (body.year < 1895 || body.year > 2024 || typeof body.year !== 'number')) {
        message = 'Year is incorrect';
    }

    if (body.rating && (body.rating < 0 || body.rating > 10 || typeof body.rating !== 'number')) {
        message = 'Rating is incorrect';
    }

    if (body.position && typeof body.position !== 'number') {
        message = 'Position should be a number';
    }

    if (parseInt(body.budget) < 0 || parseInt(body.gross) < 0 || body.position < 0) {
        message = 'Numbers cannot be negative';
    }

    if (isNaN(parseInt(body.budget))) {
        message = 'Bugdet should start with a number';
    }

    if (isNaN(parseInt(body.gross))) {
        message = 'Gross should start with a number';
    }

    if (body.poster && (!body.poster.startsWith('http') || typeof body.poster !== 'string')) {
        message = 'Poster should contain a link';
    }

    return message;
}

function correctPosition(body, newMovie) {
    let flag = true;
    let subArray = [];
    while (flag) {
        subArray = moviesArray.filter(item => item.position === body.position);
        if (subArray.length > 0 || body.position < 0) {
            flag = false;
        } else {
            body.position--;
        }
    }
    
    if (subArray.length > 0) {
        const index = moviesArray.indexOf(subArray[0]);
        moviesArray.splice(index, 0, newMovie);
        moviesArray[index].position = body.position;
        for (let i = index + 1; i < moviesArray.length; i++) {
            if (moviesArray[i].position !== body.position) moviesArray[i].position += 1;
        }
    } else {
        moviesArray.push(newMovie);
    }
}

module.exports = {
    checkUserInfo,
    checkInformation,
    correctPosition
}