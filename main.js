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
	constructor(field = [[]], startRow = 0, startCol = 0, nightmare = false) {
		this.field = field;
		this.jumpsRemaining = 0;
		// Set the home position at (0, 0) before the game starts
		this.positionRow = startRow;
		this.positionCol = startCol;
		this.enemyRow = null;
		this.enemyCol = null;
		this.nightmare = nightmare
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
				} else if (row === this.enemyRow && col === this.enemyCol) {
					rowStr += 'X'
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

	// New print() automatically render position,so we don't need markTile() anymore
	// markTile() {
	// 	this.field[this.positionRow][this.positionCol] = "*";
	// }

	// Create random position method
	static randomPosition(limit) {
		return Math.floor(Math.random() * limit);
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
			hatRow = Field.randomPosition(height);
			hatCol = Field.randomPosition(width);
		} while (hatRow === 0 && hatCol === 0);

		field[hatRow][hatCol] = '^';

		// Set player position randomly
		let playerRow, playerCol;
		do {
			playerRow = Field.randomPosition(height);
			playerCol = Field.randomPosition(width);
		} while (
			field[playerRow][playerCol] === 'O' ||
			field[playerRow][playerCol] === '^'
		);

		// Set enemy spawn
		let enemyRow, enemyCol
		do {
			enemyRow = Field.randomPosition(height);
			enemyCol = Field.randomPosition(width);
		} while (
			field[enemyRow][enemyCol] === 'O' ||
			(enemyRow === playerRow && enemyCol === playerCol) ||
			field[enemyRow][enemyCol] === '^'
		);


		return {
			field,
			playerRow,
			playerCol,
			enemyRow,
			enemyCol
		};
	}

	// Pre-made map
	static getPreMadeMap(size) {
		if (size === 4) {
			return {
				field: [
					['*', 'O', '░', '░'],
					['░', 'O', '░', '░'],
					['░', '░', '░', 'O'],
					['░', 'O', 'O', '^'],
				],
				enemyRow: null,
				enemyCol: null
			};
		} else if (size === 5) {
			return {
				field: [
					['*', 'O', '░', 'O', '░'],
					['░', '░', '░', 'O', '░'],
					['░', 'O', 'O', '░', 'O'],
					['O', 'O', '░', 'O', '░'],
					['O', '^', 'O', '░', '^'],
				],
				enemyRow: null,
				enemyCol: null
			};
		} else if (size === 6) {
			return {
				field: [
					['*', 'O', 'O', 'O', '░', '░'],
					['░', '░', '░', '░', '░', '░'],
					['O', '░', '░', '░', 'O', '░'],
					['░', 'O', '░', 'O', 'O', 'O'],
					['O', 'O', '░', '░', '░', '░'],
					['░', '^', '░', 'O', 'O', '░'],
				],
				enemyRow: 5,
				enemyCol: 2
			};
		}

		// fallback
		return {
			field: [
				['*', 'O', '░', '░'],
				['░', 'O', '░', '░'],
				['░', '░', '░', 'O'],
				['░', 'O', 'O', '^'],
			],
			enemyRow: null,
			enemyCol: null
		}
	}

	// Create getDifficulty to reduce messy logic
	static getDifficulty(level) {
		switch (level) {
			case '1': return {size: 4, jumps: 2, useEnemy: false, allowRandom: true};
			case '2': return {size: 5, jumps: 2, useEnemy: false, allowRandom: true};
			case '3': return {size: 6, jumps: 2, useEnemy: true, allowRandom: true};
			case '4': return {size: 8, jumps: 2, useEnemy: true, allowRandom: false, nightmare: true};
			default:
				// Defaulting to Easy mode
				return {size: 4, jumps: 2, useEnemy: false};
		}
	}

	// Create map selection method as well
	static selectMap(size, mapType) {
		if (mapType === 'R') {
			const result = Field.generateField(size, size, 0.4);
			return {
				field: result.field,
				playerRow: result.playerRow,
				playerCol: result.playerCol,
				enemyRow: result.enemyRow,
				enemyCol: result.enemyCol
			};
		} else if (mapType === 'P') {
			const preMade = Field.getPreMadeMap(size);
			return {
				field: preMade.field,
				playerRow: 0,
				playerCol: 0,
				enemyRow: preMade.enemyRow,
				enemyCol: preMade.enemyCol
			}
		} else {
			// fallback
			console.log("Invalid input. Using pre-made map by default.");
			const preMade = Field.getPreMadeMap(4);
			return {
				field: preMade.field,
				playerRow: 0,
				playerCol: 0,
				enemyRow: preMade.enemyRow,
				enemyCol: preMade.enemyCol
			}
		}
	}

	// Making enemy hunt player
	moveEnemy() {
		if (this.enemyRow === null || this.enemyCol === null) return;

		const directions= [
			{row: -1, col: 0},
			{row: 1, col: 0},
			{row: 0, col: -1},
			{row: 0, col: 1}
		];

		// Choose move that reduces distance to player
		let bestMove = null;
		let minDistance = Infinity;

		for (const dir of directions) {
			const newRow = this.enemyRow + dir.row;
			const newCol = this.enemyCol + dir.col;

			//Boundary check
			if (
				newRow < 0 ||newRow >= this.field.length ||
				newCol < 0 || newCol >= this.field[0].length
			) continue;

			// Is enemy in Nightmare mode?
			if (!this.nightmare && this.field[newRow][newCol]==='O') continue;

			const distance = Math.abs(newRow - this.positionRow) + Math.abs(newCol - this.positionCol);
			if (distance < minDistance) {
				minDistance = distance;
				bestMove = {row: newRow, col: newCol};
			}
		}

		// Move enemy
		if (bestMove) {
			this.enemyRow = bestMove.row;
			this.enemyCol = bestMove.col;
		}
	}

	static menu() {
		console.log("=== FIND YOUR HAT ===");
		const difficulty = prompt("Choose difficulty: \n1. Easy\n2. Medium\n3. Hard\n4. NIGHTMARE (random only)\n> ").trim();
		// const mapType = prompt("Use Pre-made map (P) or Random map (R)?").toUpperCase();

		const {size, jumps, useEnemy, allowRandom, nightmare} = this.getDifficulty(difficulty);
		let mapType = 'R';
		if (allowRandom) {
			mapType = prompt("Use Pre-made map (P) or Random map (R)?").toUpperCase();
		} else {
			console.log("Nightmare mode only allows Random maps. Setting map type to Random.")
		}
		
		const {field, playerRow, playerCol, enemyRow, enemyCol} = this.selectMap(size, mapType);

		const game = new Field(field, playerRow, playerCol);
		game.jumpsRemaining = jumps;
		game.nightmare = nightmare || false;

		if (useEnemy && enemyRow !== undefined && enemyCol !== undefined) {
			game.enemyRow = enemyRow;
			game.enemyCol = enemyCol;
		}

		game.startGame();
	}

	startGame() {
		this.print();
		if (this.nightmare) {
			console.log("NIGHTMARE MODE ACTIVATED — enemy can walk through holes!");
			}
		console.log("Use W, A, S, D to move,\n you also can jump with JW, JA, JS, JD\nor X to exit game");

		while (true) {
			console.log(`Jump remaining: ${this.jumpsRemaining}`)
			const input = prompt("Move: ").toUpperCase();

			if (input === 'X') {
				console.log("Exiting game ... Thanks for playing");
				break;
			}

			// To clear trace before move
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
						continue;
				}
			}

			// Check after moved, player's out of bound or not
			if (!this.checkBoundary()) {
				console.log("Out of bounds! Game Over");
				break;
			}

			// Is player run into enemy arms?
			if (this.enemyRow !== null &&
				this.enemyCol !== null &&
				this.positionRow === this.enemyRow &&
				this.positionCol === this.enemyCol
			) {
				console.log("You ran into enemy! Game Over");
				break;
			}

			// It's enemy turn to hunt
			this.moveEnemy();

			// Check if enemy caught the player
			if (this.enemyRow === this.positionRow && this.enemyCol === this.positionCol) {
				console.log("The enemy caught you! Game Over")
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
			this.print();
		}
	}
}

// Game Mode ON
// Remark: Code example below should be deleted and use your own code.
Field.menu()
