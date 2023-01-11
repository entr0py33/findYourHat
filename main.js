//Load prompt-sync, allow exit with ctrl+C
const prompt = require('prompt-sync')({ sigint: true });

//Global variables
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(fieldMap) {
        this._field = fieldMap;
        this._playerPosition = this.getStartingPoint();
    }

    print() {
        for (const line of this._field) {
            const lineString = line.join('');
            console.log(lineString);
        }
    }

    // Finds the * on a new map and returns it's position
    getStartingPoint() {
        for (const [y, line] of this._field.entries()) {
            // If star is found on this line ..
            const x = line.indexOf('*')
            if (x !== -1) {     //the array.indexOf() method returns -1 to mean "not found"
                const startPosition = [y, x]; 
                return startPosition;  //return location of the *
            }
        }
        // If * is never found
        throw Error('getStartingPoint(): Start Position not found');
    }

    //Start the game, print map and prompt, loop until game over
    startGame() {
        let state = 'continue';

        // Main game loop that prints map, gets user input
        while (state == 'continue') {
            console.clear();
            this.print();
            const input = prompt('Which way? ');
            // Take a step in that direction, outcome of the step is stored in state
            state = this.step(input); 

            // Check for 3 possible game-ending states. If state is still 'continue' while will loop indefinitely
            if (state == 'outOfBounds') {
                console.log('You have fallen off the edge of the earth. GAME OVER');
            }

            if (state == 'hole') {
                console.log('You have fallen in a hole and DIED');
            }

            if (state == 'win') {
                console.log('You find your hat. Congratulations!');
            }
        }
    }

    //Check result of stepping on a tile
    step(direction) {
        // Update player position
        if (direction == 'w')
            this._playerPosition[0] -= 1;
        else if (direction == 's')
            this._playerPosition[0] += 1;
        else if (direction == 'a')
            this._playerPosition[1] -= 1;
        else if (direction == 'd')
            this._playerPosition[1] += 1;
        else
            console.log('Use w, a, s or, d');

        const y = this._playerPosition[0];
        const x = this._playerPosition[1];
        let tile = '';

        // Check if moved off map
        if (y < 0 || y >= this._field.length || x < 0 || x >= this._field[y].length)
            return 'outOfBounds';
        else
            tile = this._field[y][x];  // value of tile at new position

        // Check for win, hole, or continue
        if (tile == 'O')
            return 'hole';
        else if (tile == '^')
            return 'win';
        else {
            this._field[y][x] = '*'; 
            return 'continue';
        }
    }

    // Create a random field with placed starting point, hat and holes
    static generateField(yLength, xLength) {
        //Build empty field
        const area = yLength * xLength;
        let newField = [];
        for (let i = 0; i < yLength; i++) {
            let line = new Array(xLength); //lines must be initilized to the correct length so that array.fill() will work
            line.fill(fieldCharacter);
            newField.push(line); // Build up the field one line at a time
        }

        //Place Start 
        Field.placeTile("*", newField);

        //Place Hat
        Field.placeTile("^", newField);

        //Place Holes
        const numHoles = Math.floor(area * 0.25); //assumes we want 25% holes for medium difficulty
        for (let i = 0; i < numHoles; i++) {
            Field.placeTile('O', newField);
        }

        return newField;
    }

    // Places a given tile character in a random position
    static placeTile(tile, fieldMap) {
        let placed = false;
        while (!placed) {
            // Randomly choose a position
            let y = Math.floor(Math.random() * fieldMap.length);
            let x = Math.floor(Math.random() * fieldMap[0].length);

            // Check the existing tile at that position
            let oldTile = fieldMap[y][x];

            // If tile is ░ place new tile, otherwise try again
            if (oldTile == fieldCharacter) {
                fieldMap[y][x] = tile;
                placed = true;
            }
        }// END while
    }// END placeTile()
} //END Field

//test field map from codeCademy
const fieldMap = [
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
];

const randomField = Field.generateField(15, 30);
const myField = new Field(randomField);
myField.startGame();