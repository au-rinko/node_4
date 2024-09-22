const fs = require('fs');

const API_KEY = '0152Y11-92R4KF4-N78B2Z9-69YT8VA';
const TOP_250 = 'https://api.kinopoisk.dev/v1.4/movie?page=1&limit=250&lists=top250&selectFields=id&selectFields=name&selectFields=year&selectFields=rating&selectFields=budget&selectFields=poster&selectFields=fees&selectFields=top250';

let moviesArray = [];

async function getTop250Movies(url) {
    const body = {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY
        },
    };
    const res = await fetch(url, body);
    const resData = await res.json();
    createJsonFile(resData.docs);
}

function createJsonFile(data) {
    moviesArray = data;

    moviesArray = moviesArray.map(item => item = {
        id: item.id,
        name: item.name,
        rating: item.rating.kp,
        year: item.year,
        budget: (item.budget && item.budget.value) ? `${item.budget.value}${item.budget.currency}` : null,
        gross: (item.fees && item.fees.world && item.fees.world.value) ? `${item.fees?.world.value}${item.fees.world.currency}` : (item.fees && item.fees.russia && item.fees.russia.value) ? `${item.fees?.russia.value}${item.fees.russia.currency}` : null,
        poster: item.poster.url,
        position: item.top250
      }).filter(item => item.position).sort((a, b) => a.position - b.position);

    fs.writeFile('./movies.json', JSON.stringify(moviesArray), (err) => {
        if(err) console.log(err);
    });
}

function writeToFile(data) {
    fs.writeFile('./movies.json', JSON.stringify(data), (err) => {
        if(err) console.log(err);
    });
}

module.exports = {
    getTop250Movies,
    writeToFile,
    TOP_250,
}