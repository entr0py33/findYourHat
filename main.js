const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const haveHat = prompt('Gentlemen, do you own a hat?');

if (haveHat == 'yes')
    console.log('Jolly good!');
else
    console.log('For shame!');