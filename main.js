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
	constructor(field = [[]], startRow = 0, startCol = 0) {
		this.field = field;
		this.jumpsRemaining = 0;
		// Set the home position at (0, 0) before the game starts
		this.positionRow = startRow;
		this.positionCol = startCol;
		// this.field[this.positionRow][this.positionCol] = pathCharacter;
	}

	// Print field //
	print() {
		clear();

		for (let row = 0; row < this.field.length; row++) {
			let rowStr = ''

			for (let col = 0; col < this.field[row].length; col++) {
				if (row === this.positionRow && col === this.positionCol) {
					rowStr += '*';
				} else {
					rowStr += this.field[row][col];
				}
			}
			console.log(rowStr);
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

	// Jump system
	jump(direction) {
		if (this.jumpsRemaining <= 0) {
			return;
		}

		this.clearTile();

		switch (direction) {
			case 'W': this.positionRow -= 2; break;
			case 'S': this.positionRow += 2; break;
			case 'A': this.positionCol -= 2; break;
			case 'D': this.positionCol += 2; break;
			default:
				console.log("Invalid jump direction.");
				return;
		}
		this.jumpsRemaining--;
	}

	// To check if player fell out of bound (fixed bug)
	checkBoundary() {
		const rowInBounds = this.positionRow >= 0 && this.positionRow < this.field.length;
		const colInBounds = this.positionCol >= 0 && this.positionCol < this.field[0].length;

		return rowInBounds && colInBounds;
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

		// Set hat position
		let hatRow, hatCol;

		do {
			hatRow = Math.floor(Math.random() * height);
			hatCol = Math.floor(Math.random() * width);
		} while (hatRow === 0 && hatCol === 0);

		field[hatRow][hatCol] = '^';

		// Set player position randomly
		let playerRow, playerCol;
		do {
			playerRow = Math.floor(Math.random() * height);
			playerCol = Math.floor(Math.random() * width);
		} while (
			field[playerRow][playerCol] === 'O' ||
			field[playerRow][playerCol] === '^'
		);



		return {
			field,
			playerRow,
			playerCol
		};
	}

	// Pre-made map
	static getPreMadeMap(size) {
		if (size === 4) {
			return [
				['*', 'O', '░', '░'],
				['░', 'O', '░', '░'],
				['░', '░', '░', 'O'],
				['░', 'O', 'O', '^'],
			];
		} else if (size === 5) {
			return [
				['*', 'O', '░', 'O', '░'],
				['░', '░', '░', 'O', '░'],
				['░', 'O', 'O', '░', 'O'],
				['O', 'O', '░', 'O', '░'],
				['O', '^', 'O', '░', '^'],
			];
		} else if (size === 6) {
			return [
				['*', 'O', 'O', 'O', '░', '░'],
				['░', '░', '░', '░', '░', 'O'],
				['O', '░', '░', '░', 'O', '░'],
				['░', 'O', '░', 'O', 'O', '░'],
				['O', 'O', '░', '░', '░', '░'],
				['░', '^', '░', 'O', 'O', '░'],
			]
		}
	}

	static menu() {
		console.log("=== FIND YOUR HAT ===");
		const difficulty = prompt("Choose difficulty: \n1. Easy\n2. Medium\n3. Hard\n> ").trim();
		const mapType = prompt("Use Pre-made map (P) or Random map (R)?").toUpperCase();
	
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
			const holePercentage = 0.4;
			const result = Field.generateField(size, size, holePercentage);
			field = result.field;
			this.positionRow = result.playerRow;
			this.positionCol = result.playerCol;
		} else {
			console.log("Invalid input. Using pre-made by default.");
			field = Field.getPreMadeMap(size);
		}

		// Start game
		const game = new Field(field, this.positionRow, this.positionCol);
		game.jumpsRemaining = jumps;
		// if (useEnemy) {
		// 	game.enemyRow = size -1;
		// 	game.enemyCol = size -1;
		// }

		game.startGame();
	}

	startGame() {
		this.print();
		console.log("Use W, A, S, D to move,\n you also can jump with JW, JA, JS, JD\nor X to exit game");

		while (true) {
			console.log(`Jump remaining: ${this.jumpsRemaining}`)
			const input = prompt("Move: ").toUpperCase();

			if (input === 'X') {
				console.log("Exiting game ... Thanks for playing");
				break;
			}

			this.clearTile();

			// Moving logic
			if (input.startsWith('J')) {
				const jumDir = input[1];
				this.jump(jumDir);
			} else {
				switch (input) {
					case 'W': this.moveUp(); break;
					case 'A': this.moveLeft(); break;
					case 'S': this.moveDown(); break;
					case 'D': this.moveRight(); break;
					default:
						console.log("Invalid input");
						this.markTile();
						continue;
				}
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
Field.menu()
