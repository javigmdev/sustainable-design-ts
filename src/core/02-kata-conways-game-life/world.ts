import { Cell, CellStatus } from './cell';

export class World {
  private constructor(readonly cellMatrix: Cell[][]) {}

  static createFrom(initialStatus: CellStatus[][]) {
    const cellMatrix = initialStatus.map((row) => row.map((status) => Cell.create(status)));
    return new World(cellMatrix);
  }

  nextGeneration() {
    const nextCellMatrix = this.cellMatrix.map((row, rowIndex) =>
      row.map((cell, columnIndex) => cell.regenerate(this.aliveNeighbors(rowIndex, columnIndex)))
    );
    return new World(nextCellMatrix);
  }

  private aliveNeighbors(row: number, column: number) {
    return (
      this.aliveColumnNeighbors(column, row) +
      this.aliveNeighborsInPreviousRow(row, column) +
      this.aliveNeighborsInNextRow(row, column)
    );
  }
  private aliveNeighborsInPreviousRow(row: number, column: number) {
    let aliveNeighbors = 0;
    const previousRow = row - 1;
    if (previousRow >= 0) {
      if (this.isAliveCellAt(previousRow, column)) {
        aliveNeighbors++;
      }
      aliveNeighbors += this.aliveColumnNeighbors(column, previousRow);
    }
    return aliveNeighbors;
  }

  private aliveNeighborsInNextRow(row: number, column: number) {
    let aliveNeighbors = 0;
    const nextRow = row + 1;
    if (nextRow < this.cellMatrix.length) {
      if (this.isAliveCellAt(nextRow, column)) {
        aliveNeighbors++;
      }
      aliveNeighbors += this.aliveColumnNeighbors(column, nextRow);
    }
    return aliveNeighbors;
  }

  private aliveColumnNeighbors(column: number, row: number) {
    let aliveNeighbors = 0;
    const previousColumn = column - 1;
    if (column - 1 >= 0 && this.isAliveCellAt(row, previousColumn)) {
      aliveNeighbors++;
    }
    const nextColumn = column + 1;
    const rowLength = this.cellMatrix[row].length;
    if (nextColumn < rowLength && this.isAliveCellAt(row, nextColumn)) {
      aliveNeighbors++;
    }
    return aliveNeighbors;
  }

  private isAliveCellAt(row: number, column: number) {
    return this.cellMatrix[row][column].isAlive();
  }
}
