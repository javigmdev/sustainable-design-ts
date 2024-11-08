import { Cell, CellStatus } from '../../core/02-kata-conways-game-life/cell';

describe('In the game of life', () => {
  it('any live cell with fewer than two live neighbors dies, as if caused by underpopulation', () => {
    expect(Cell.create(CellStatus.Alive).regenerate(1).isAlive()).toBe(false);
    expect(Cell.create(CellStatus.Dead).regenerate(1).isAlive()).toBe(false);
  });
  it('any live cell with two or three live neighbors lives on to the next generation', () => {
    expect(Cell.create(CellStatus.Alive).regenerate(2).isAlive()).toBe(true);
    expect(Cell.create(CellStatus.Alive).regenerate(3).isAlive()).toBe(true);
    expect(Cell.create(CellStatus.Dead).regenerate(2).isAlive()).toBe(false);
  });
  it('any live cell with more than tree live neighbors dies, as if by overcrowding', () => {
    expect(Cell.create(CellStatus.Alive).regenerate(4).isAlive()).toBe(false);
    expect(Cell.create(CellStatus.Dead).regenerate(4).isAlive()).toBe(false);
  });
  it('any dead cell with exactly three live neighbors becomes a live cell', () => {
    expect(Cell.create(CellStatus.Dead).regenerate(3).isAlive()).toBe(true);
  });
});
