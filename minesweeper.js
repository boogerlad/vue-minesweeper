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
		for(let i = 0; i < this.bombs; ++i) {
			this.tiles[i] = new Tile(9);
		}
		for(let i = this.bombs; i < this.tiles.length; ++i) {
			this.tiles[i] = new Tile(0);
		}
		for(let i = this.tiles.length - 1; i > 0; --i) {
			let temp = this.tiles[i];
			let randomIndex = Math.trunc(Math.random() * (i + 1));
			this.tiles[i] = this.tiles[randomIndex];
			this.tiles[randomIndex] = temp;
		}
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
	one2two(index) {
		return [Math.trunc(index / this.horizontal), index % this.horizontal];
	}
	two2one(row, column) {
		return row * this.horizontal + column;
	}
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
	reveal(row, column) {
		this.actuallyReveal(this.two2one(row, column));
	}
	actuallyReveal(index) {
		let tile = this.tiles[index];
		if(!tile.revealed && !tile.flagged) {
			tile.revealed = true;
			if(--this.hidden === this.bombs) {
				alert("you win");
			} else if(tile.bombCount === 9) {
				alert("game over");
			} else if(tile.bombCount === 0) {
				this.adjacent(...this.one2two(index), this.actuallyReveal.bind(this));
			}
		}
	}
	flag(row, column) {
		let index = this.two2one(row, column);
		if(!this.tiles[index].revealed) {
			this.tiles[index].flagged = !this.tiles[index].flagged;
		}
	}
}