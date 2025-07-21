"use strict";
// JS Assessment: Find Your Hat //
import promptSync from "prompt-sync";
import clear from "clear-screen";

const prompt = promptSync({ sigint: true });


const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
	constructor(field = [[]]) {
		this.field = field;

		// Replace with your own code //
		// Set the home position at (0, 0) before the game starts
		this.positionRow = 0;
		this.positionCol = 0;
		this.field[this.positionRow][this.positionCol] = pathCharacter;
	}

	// Print field //
	print() {
		clear();
		for (let row of this.field) {
			console.log(row.join(''));
		}

	}

	// Moving section
	moveUp() {
		this.positionRow--;
	}

	moveDown() {
		this.positionRow++;
	}

	moveLeft() {
		this.positionCol--;
	}

	moveRight() {
		this.positionCol++;
	}

	// To check if player fell out of bound
	checkBoundary() {
		const numRows = this.field.length;
		const numCols = this.field[0].length;

		if (this.positionRow < 0 || this.positionRow >= numRows ||
			this.positionCol < 0 || this.positionCol >= numCols
		) {
			return false;
		}
		return true;
	}

	// To get current tile (position)
	getCurrentTile() {
		return this.field[this.positionRow][this.positionCol];
	}

	// To check whether player win or lose by falling into a hole
	checkGameOver() {
		const tile = this.getCurrentTile();
		if (tile === 'O') return "lose";
		if (tile === '^') return "win";
		return false;
	}

	// To clear previous tile after moved
	clearTile() {
		this.field[this.positionRow][this.positionCol] = "░";
	}

	// To mark where player's standing
	markTile() {
		this.field[this.positionRow][this.positionCol] = "*";
	}

	// Map generation
	static generateField(height, width, holePercentage) {
		const field = [];

		for (let row = 0; row < height; row++) {
			const rowArr = [];
			for (let col = 0; col < width; col++) {
				const isHole = Math.random() < holePercentage;
				rowArr.push(isHole? 'O' : '░');
			}
			field.push(rowArr);
		}
		// Set player at [0][0]
		field[0][0] = '*';

		// Set hat position
		let hatRow, hatCol;

		do {
			hatRow = Math.floor(Math.random() * height);
			hatCol = Math.floor(Math.random() * width);
		} while (hatRow === 0 && hatCol === 0);

		field[hatRow][hatCol] = '^';

		return field;
	}

	static menu() {
		console.log("=== FIND YOUR HAT ===");
		const difficulty = prompt("Choose difficulty: \n1. Easy\n2. Medium\n3. Hard\n> ").trim();
		const mapType = promp("Use Pre-made map (P) or Random map (R)?").toUpperCase();
	
		let field;
		let jumps = 2;
		let useEnemy = false;
		let size = 4;

		// Difficulty settings
		switch (difficulty) {
			case '1':
				jumps = 2;
				size = 4;
				break;
			case '2':
				jumps = 2;
				size = 5;
				break;
			case '3':
				jumps = 1;
				size = 6;
				useEnemy = true;
				break;
			default:
				console.log("Invalid input. Defaulting to Easy.");
				jumps = 2;
				size = 4;
		}

		// Map selection
		if (mapType === 'P') {
			field = Field.getPreMadeMap(size);
		} else if (mapType === 'R') {
			const holePercentage = 0.3;
			field.generateField(size, size, holePercentage);
		} else {
			console.log("Invalid input. Using pre-made by default.");
			field = Field.getPreMadeMap(size);
		}


	}

	startGame() {
		this.print();
		console.log("Use W, A, S, D to move or X to exit game");

		while (true) {
			const input = prompt("Move: ").toUpperCase();

			if (input === 'X') {
				console.log("Exiting game ... Thanks for playing");
				break;
			}

			this.clearTile();

			// Moving logic
			switch (input) {
				case 'W':
					this.moveUp();
					break;
				case 'A':
					this.moveRight();
					break;
				case 'S':
					this.moveDown();
					break;
				case 'D':
					this.moveRight();
					break;
				default:
					console.log("Invalit input");
					this.markTile();
					continue;
			}

			// Check after moved, player's out of bound or not
			if (!this.checkBoundary()) {
				console.log("Out of bounds! Game Over");
				break;
			}

			// Check if player win or lose
			const status = this.checkGameOver();
			if (status === 'win') {
				console.log("You found the hat! You win");
				break;
			} else if (status === 'lose') {
				console.log("You fell in a hole! Game Over");
				break;
			}

			// If game not over yet, continue playing
			this.markTile();
			this.print();
		}
	}
}

// Game Mode ON
// Remark: Code example below should be deleted and use your own code.
const newGame = new Field([
	["░", "░", "O"],
	["░", "O", "░"],
	["░", "^", "░"],
]);
newGame.startGame();
