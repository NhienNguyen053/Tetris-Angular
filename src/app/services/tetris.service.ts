import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Grid, Tetromino, TETROMINOES } from '../types';
import { createEmptyGrid, COLS, checkForCells, filterPositions, getRandomTetrominoKey, checkIfOverlap } from '../components/tetris-board/tetris-board.service';

@Injectable({
    providedIn: 'root'
})
export class TetrisService {
    private grid = new BehaviorSubject<Grid>(createEmptyGrid());
    grid$ = this.grid.asObservable();
    
    private isRunning = new BehaviorSubject<boolean>(false);
    isRunning$ = this.isRunning.asObservable();
    
    private tetrominoPositions: { row: number; col: number }[] = [];
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
            console.log(this.isRunning.value)
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
        this.grid.next(newGrid);
        this.tetrominoAtBottom = false;
    }

    moveTetromino(direction: 'down' | 'left' | 'right') {
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
        } else if (isBlocked === 'blocked' || isBlocked === 'blocked-x') {
        } else {
            this.insertTetromino();
            this.tetrominoAtBottom = true;
        }
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
        if (!this.gameInterval) {
            this.startGameInterval();
        }
    }

    stopGame() {
        this.isRunning.next(false);
    }
}