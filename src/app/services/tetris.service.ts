import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Grid, Tetromino, TETROMINOES } from '../types';
import { createEmptyGrid, COLS, checkForCells, filterPositions, getRandomTetrominoKey, ROWS } from '../components/tetris-board/tetris-board.service';

@Injectable({
    providedIn: 'root'
})
export class TetrisService {
    private grid = new BehaviorSubject<Grid>(createEmptyGrid());
    grid$ = this.grid.asObservable();
    
    private isRunning = new BehaviorSubject<boolean>(false);
    isRunning$ = this.isRunning.asObservable();
    
    private tetrominoPositions: { row: number; col: number }[] = [];
    private center: { row: number; col: number } = { row: 0, col: 0};
    private tetrominoAtBottom = true;
    private tetromino: Tetromino = TETROMINOES['I'];
    private gameInterval: any;

    ngOnDestroy(): void {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
    }

    startGameInterval(): void {
        this.gameInterval = setInterval(() => {
            if (this.isRunning.value) {
                this.runGame();
            } else {
                clearInterval(this.gameInterval);
            }
        }, 2000);
    }

    insertTetromino() {
        const randomTetrominoKey = getRandomTetrominoKey();
        this.tetromino = TETROMINOES[randomTetrominoKey];
        const shape = this.tetromino.shape;
    
        const startRow = 0;
        const startCol = Math.floor(COLS / 2) - Math.floor(shape[0].length / 2);
    
        const newGrid = this.grid.getValue().map(row => [...row]);
    
        for (let rowIndex = 0; rowIndex < shape.length; rowIndex++) {
            for (let colIndex = 0; colIndex < shape[rowIndex].length; colIndex++) {
                if (shape[rowIndex][colIndex] === 1) {
                    const gridRow = startRow + rowIndex;
                    const gridCol = startCol + colIndex;
    
                    if (gridRow < 0 || gridRow >= ROWS || gridCol < 0 || gridCol >= COLS || newGrid[gridRow][gridCol].value === 1) {
                        this.stopGame();
                        return;
                    }
                }
            }
        }
        const tetrominoPositions: { row: number; col: number }[] = [];
        shape.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 1) {
                    const gridRow = startRow + rowIndex;
                    const gridCol = startCol + colIndex;
    
                    newGrid[gridRow][gridCol].value = 1;
                    newGrid[gridRow][gridCol].color = this.tetromino.color;
    
                    tetrominoPositions.push({ row: gridRow, col: gridCol });
                }
            });
        });
    
        this.tetrominoPositions = tetrominoPositions;
        if (randomTetrominoKey === 'T') {
            this.center = tetrominoPositions[2];
        } else if (randomTetrominoKey === 'I') {
            this.center = tetrominoPositions[1];
        }
        this.grid.next(newGrid);
        this.tetrominoAtBottom = false;
    }

    moveTetromino(direction: 'down' | 'left' | 'right'): boolean {
        const currentPosition = this.tetrominoPositions;
        const directionPositions = filterPositions(currentPosition, direction);
        const isBlocked = checkForCells(directionPositions, this.grid.getValue(), direction);

        if (isBlocked === 'unblocked') {
            const newPositions = this.tetrominoPositions.map((position) => {
                let newRow = position.row;
                let newCol = position.col;
                if (direction === 'down') {
                    newRow = position.row + 1;
                } else if (direction === 'left') {
                    newCol = position.col - 1;
                } else if (direction === 'right') {
                    newCol = position.col + 1;
                }
                return { row: newRow, col: newCol };
            });
            if (direction === 'down') {
                this.center.row += 1;
            } else if (direction === 'left') {
                this.center.col -= 1;
            } else if (direction === 'right') {
                this.center.col += 1;
            }            
            const newGrid = this.grid.getValue().map(row => [...row]);

            this.tetrominoPositions.forEach((position) => {
                const { row, col } = position;
                newGrid[row][col].value = 0;
                newGrid[row][col].color = '';
            });

            newPositions.forEach((position) => {
                const { row, col } = position;
                newGrid[row][col].value = 1;
                newGrid[row][col].color = this.tetromino.color;
            });

            this.grid.next(newGrid);
            this.tetrominoPositions = newPositions;
            this.tetrominoAtBottom = false;
            return true;
        } else if (isBlocked === 'blocked' || isBlocked === 'blocked-x') {
            return false;
        } else {
            this.insertTetromino();
            return false;
        }
    }

    rotateTetromino() {
        var oldPositions = [];
        var newPositions = [];
        var newGrid = this.grid.getValue();
    
        if (this.tetromino === TETROMINOES['T']) {
            const moves = [
                { check: [-1, -1], from: [0, -1], to: [-1, 0] },
                { check: [-1, 1], from: [-1, 0], to: [0, 1] },
                { check: [1, 1], from: [0, 1], to: [1, 0] },
                { check: [1, -1], from: [1, 0], to: [0, -1] }
            ];
    
            for (let { check, from, to } of moves) {
                let [cr, cc] = [this.center.row + check[0], this.center.col + check[1]];
                let [fr, fc] = [this.center.row + from[0], this.center.col + from[1]];
                let [tr, tc] = [this.center.row + to[0], this.center.col + to[1]];
    
                if (newGrid[fr][fc] && newGrid[fr][fc].value === 1) {
                    if (newGrid[cr][cc] && newGrid[cr][cc].value === 0) {
                        oldPositions.push({ row: fr, col: fc });
                        newPositions.push({ row: tr, col: tc });
                    } else {
                        return;
                    }
                }
            }
        }
    
        newPositions.push({ row: this.center.row, col: this.center.col});
        for (let pos of oldPositions) {
            newGrid[pos.row][pos.col].value = 0;
            newGrid[pos.row][pos.col].color = "";
        }
        for (let pos of newPositions) {
            newGrid[pos.row][pos.col].value = 1;
            newGrid[pos.row][pos.col].color = '#9a00cd';
        }
    
        this.grid.next(newGrid);
        this.tetrominoPositions = newPositions;
    }    

    runGame() {
        if (this.tetrominoAtBottom) {
            this.insertTetromino();
        } else {
            this.moveTetromino('down');
        }
    }

    startGame() {
        this.isRunning.next(true);
        if (this.tetrominoPositions.length === 0) {
            this.insertTetromino();
        }
    
        if (!this.gameInterval) {
            this.startGameInterval();
        }
    }

    stopGame() {
        this.isRunning.next(false);
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
    }

    restartGame() {
        this.isRunning.next(false);
        clearInterval(this.gameInterval);
        this.gameInterval = null;
        this.grid.next(createEmptyGrid());
    }
}