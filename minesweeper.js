class Tile {
	constructor(bombCount) {//0-8 bombs since only 8 adjacent. 9 represents that it is a bomb
		this.bombCount = bombCount;
		this.revealed = false;
		this.flagged = false;
	}
}

class Grid {
	constructor(vertical, horizontal, bombs) {
		this.vertical = vertical;
		this.horizontal = horizontal;
		this.tiles = new Array(vertical * horizontal);
		this.bombs = Math.min(bombs, this.tiles.length);
		this.hidden = this.tiles.length;
		this.gameOver = false;
		//populate the beginning of the array with bombs
		for(let i = 0; i < this.bombs; ++i) {
			this.tiles[i] = new Tile(9);
		}
		//populate the rest of the array with non-bombs. number of bombs adjacent to each tile cannot be known until after shuffling
		for(let i = this.bombs; i < this.tiles.length; ++i) {
			this.tiles[i] = new Tile(0);
		}
		//https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
		for(let i = this.tiles.length - 1; i > 0; --i) {
			let temp = this.tiles[i];
			let randomIndex = Math.trunc(Math.random() * (i + 1));
			this.tiles[i] = this.tiles[randomIndex];
			this.tiles[randomIndex] = temp;
		}
		//for each bomb, increment adjacent tiles' bomb counts by one
		for(let i = 0; i < this.tiles.length; ++i) {
			if(this.tiles[i].bombCount === 9) {
				this.adjacent(...this.one2two(i), index => {
					if(this.tiles[index].bombCount !== 9) {
						++this.tiles[index].bombCount;
					}
				});
			}
		}
	}
	//since grid is represented by a 1 dimensional array instead of a 2 dimensional one, need to do some math to get the row #, column #
	one2two(index) {
		return [Math.trunc(index / this.horizontal), index % this.horizontal];
	}
	//and vice versa
	two2one(row, column) {
		return row * this.horizontal + column;
	}
	//can pass in a function to apply function to all tiles adjacent to row, column
	//bounds checking important here! imagine adjacent of corner. would have negative / non existent indices!
	adjacent(row, column, f) {
		let maxRow = Math.min(this.vertical, row + 2);
		let maxColumn = Math.min(this.horizontal, column + 2);
		for(let i = Math.max(0, row - 1); i < maxRow; ++i) {
			for(let j = Math.max(0, column - 1); j < maxColumn; ++j) {
				if(i !== row || j !== column) {
					f(i * this.horizontal + j);
				}
			}
		}
	}
	//bounds checking not necessary for reveal and flag because row and column are given by ui click, which will always be valid
	reveal(row, column) {
		if(!this.gameOver) {
			this.actuallyReveal(this.two2one(row, column));
		}
	}
	//recursively reveal when no bombs for convenience
	actuallyReveal(index) {
		let tile = this.tiles[index];
		if(!tile.revealed && !tile.flagged) {
			tile.revealed = true;
			if(tile.bombCount === 9) {
				alert("game over");
				for(let i = 0; i < this.tiles.length; ++i) {
					this.tiles[i].revealed = true;
				}
				this.gameOver = true;
			} else if(--this.hidden === this.bombs) {
				alert("you win");
				this.gameOver = true;
			} else if(tile.bombCount === 0) {
				this.adjacent(...this.one2two(index), this.actuallyReveal.bind(this));
			}
		}
	}
	flag(row, column) {
		if(!this.gameOver) {
			let tile = this.tiles[this.two2one(row, column)];
			if(!tile.revealed) {
				tile.flagged = !tile.flagged;
			}
		}
	}
}