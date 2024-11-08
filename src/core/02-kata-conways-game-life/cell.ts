export enum CellStatus {
  Dead = 0,
  Alive = 1,
}

export class Cell {
  private constructor(private readonly status: CellStatus) {}

  static create(status: CellStatus) {
    if (status == null) {
      throw new Error('Invalid status');
    }
    return new Cell(status);
  }

  regenerate(numberOfNeighbors: number) {
    const nextStatus =
      this.status === CellStatus.Alive
        ? this.statusForAliveCell(numberOfNeighbors)
        : this.statusForDeadCell(numberOfNeighbors);
    return new Cell(nextStatus);
  }

  isAlive() {
    return this.status === CellStatus.Alive;
  }

  private statusForAliveCell(numberOfNeighbors: number) {
    const isStablePopulaton = numberOfNeighbors === 2 || numberOfNeighbors === 3;
    return isStablePopulaton ? CellStatus.Alive : CellStatus.Dead;
  }

  private statusForDeadCell(numberOfNeighbors: number) {
    const isFertilePopulation = numberOfNeighbors === 3;
    return isFertilePopulation ? CellStatus.Alive : CellStatus.Dead;
  }
}
