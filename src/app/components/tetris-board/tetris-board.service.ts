import { Grid, TETROMINOES } from "../../types";

export const ROWS = 20;
export const COLS = 10;

export const getRandomTetrominoKey = () => {
  const keys = Object.keys(TETROMINOES) as (keyof typeof TETROMINOES)[];
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
};

export const createEmptyGrid = (): Grid => {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ value: 0, color: "" }))
  );
};

export const filterPositions = (positions: { row: number; col: number }[], direction: string) => {
  switch (direction) {
    case 'down':
      const bottomPositions = positions.filter((current, _, arr) => {
        const isAboveAny = arr.some(
          (other) => other.row > current.row && other.col === current.col
        );
        return !isAboveAny;
      });   
      return bottomPositions;
    
    case 'left':
      const leftPositions = positions.filter((current, _, arr) => {
        const isToTheLeftOfAny = arr.some(
          (other) => other.row === current.row && other.col < current.col
        );
        return !isToTheLeftOfAny;
      });   
      return leftPositions;
    
    case 'right':
      const rightPositions = positions.filter((current, _, arr) => {
        const isToTheRightOfAny = arr.some(
          (other) => other.row === current.row && other.col > current.col
        );
        return !isToTheRightOfAny;
      });   
      return rightPositions;
    
    default:
      return [];
  }
};

export const checkIfOverlap = (positions: { row: number; col: number }[], grid: Grid): boolean => {
  for (const position of positions) {
    const { row, col } = position;

    if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
      const cell = grid[row][col];
      
      if (cell.value === 1) {
        return true;
      }
    } else {
      return true;
    }
  }
  return false;
};

export const checkForCells = (positions: { row: number; col: number }[], grid: Grid, direction: "down" | "left" | "right") => {
  for (const position of positions) {
    const { row, col } = position;

    let targetRow = row;
    let targetCol = col;

    if (direction === "down") {
      targetRow = row + 1;
    } else if (direction === "left") {
      targetCol = col - 1;
    } else if (direction === "right") {
      targetCol = col + 1;
    }
    
    if (targetRow >= ROWS) {
      return 'blocked-y';
    } else if (targetCol < COLS) {
      const targetCell = grid[targetRow][targetCol];
      if (targetCell?.value === 1) {
        return 'blocked-y';
      }
    }

    if (targetCol >= 0 && targetCol < COLS) {
      const targetCell = grid[targetRow][targetCol];
      if (targetCell?.value === 1) {
        return 'blocked';
      }
    } else {
      return 'blocked-x';
    }
  }
  return 'unblocked';
};