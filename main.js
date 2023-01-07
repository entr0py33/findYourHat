//Load prompt-sync, allow exit with ctrl+C
const prompt = require('prompt-sync')({sigint: true});

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

    getStartingPoint() {
        for (const [y, line] of this._field.entries()) {
            // If star is found on this line
            const x = line.indexOf('*')
            if (x !== -1){
                const startPosition = [y,x];
                return startPosition;
            }
        }
        // If never found
        console.log('ERROR in getStartPosition(): Start Position not found');
    }

    //Start the game, print map and prompt, possibly loop
    startGame(){
        let state = 'continue';

        // Main game loop that prints map, gets user input
        while (state == 'continue') {
            console.clear();
            this.print();
            const input = prompt('Which way? ');
            state = this.step(input);

            if (state == 'outOfBounds') {
                console.log('You have fallen off the edge of the earth. GAME OVER');
            }
                
            if (state == 'hole'){
                console.log('You have fallen in a hole and DIED');
            }

            if (state == 'win'){
                console.log('You find your hat. Congratulations!');
            }
        }
    }

    //Check result of stepping on a tile
    step(direction){
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
            tile = this._field[y][x];

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

    static generateField(yLength, xLength){
        //Build empty field
        const area = yLength * xLength;
        let newField = [];
        for (let i = 0; i < yLength; i++){
            let line = new Array(xLength);
            line.fill(fieldCharacter);
            newField.push(line);
        }

        //Place Start 
        placeTile("*", newField);

        //Place Hat
        placeTile("^", newField);   
        console.log(newField);

        //Place Holes
        const numHoles = Math.floor(area * 0.25);
        for (let i = 0; i < numHoles; i++){
            placeTile('O', newField);
        }

        return newField;
    }
} //END Field

function placeTile(tile, fieldMap) {
    let placed = false;
    while (!placed){
        let y = Math.floor(Math.random() * fieldMap.length);
        let x = Math.floor(Math.random() * fieldMap[0].length);
        let oldTile = fieldMap[y][x];
        if (oldTile == fieldCharacter){
                fieldMap[y][x] = tile;
                placed = true;
            }
    }
}

//test field map
const fieldMap = [
    ['*','░','O'],
    ['░','O','░'],
    ['░','^','░'],
];

const randomField = Field.generateField(5,15);
const myField = new Field(randomField);
myField.startGame();