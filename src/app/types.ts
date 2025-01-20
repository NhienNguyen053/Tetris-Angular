export type Cell = {
    value: number;
    color: string; 
};
  
export type Grid = Cell[][];

export type Tetromino = {
  shape: number[][] | number[][][] | number[][][][];
  color: string;
};

export const TETROMINOES: Record<string, Tetromino> = {
    T: { 
        shape: [[0, 1, 0], [1, 1, 1]],
        color: "#9a00cd"
    },
    I: {
        shape: [[1], [1], [1], [1]],
        color: "#00cdcd"
    },
    O: {
        shape: [[1, 1], [1, 1]],
        color: '#cdcd00'
    },
    Z: {
        shape: [[0, 1], [1, 1], [1, 0]],
        color: '#cd0000'
    },
    S: {
        shape: [[1, 0], [1, 1], [0, 1]],
        color: '#00cd00'
    },
    L: {
        shape: [[1, 0], [1, 0], [1, 1]],
        color: '#cd6600'
    },
    J: {
        shape: [[0, 1], [0, 1], [1, 1]],
        color: '#0000cd'
    }
};