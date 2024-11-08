import { Cell, CellStatus } from '../../core/02-kata-conways-game-life/cell';
import { World } from '../../core/02-kata-conways-game-life/world';
const { Alive, Dead } = CellStatus;

describe('The World', () => {
  it('creates a cell matrix for a given cell status', () => {
    const initialStatus = [
      [Dead, Dead],
      [Dead, Alive],
    ];
    const world = World.createFrom(initialStatus);
    expect(world.cellMatrix).toEqual([
      [Cell.create(Dead), Cell.create(Dead)],
      [Cell.create(Dead), Cell.create(Alive)],
    ]);
  });

  it('generates the next state of the game', () => {
    const world = World.createFrom([
      [Dead, Alive, Dead],
      [Dead, Alive, Dead],
      [Dead, Alive, Dead],
    ]);

    const nextState = world.nextGeneration().cellMatrix;

    expect(nextState).toEqual([
      [Cell.create(Dead), Cell.create(Dead), Cell.create(Dead)],
      [Cell.create(Alive), Cell.create(Alive), Cell.create(Alive)],
      [Cell.create(Dead), Cell.create(Dead), Cell.create(Dead)],
    ]);
  });

  it('never changes for a given initial block pattern', () => {
    const world = World.createFrom([
      [Alive, Alive, Dead],
      [Alive, Alive, Dead],
      [Dead, Dead, Dead],
    ]);

    const nextWorld = world.nextGeneration().nextGeneration().nextGeneration();

    expect(nextWorld).toEqual(world);
  });

  it('reestablishes the same state after two generation when a given oscillator pattern is provided', () => {
    const world = World.createFrom([
      [Dead, Alive, Dead],
      [Dead, Alive, Dead],
      [Dead, Alive, Dead],
    ]);

    const nextWorld = world.nextGeneration().nextGeneration();

    expect(nextWorld).toEqual(world);
  });
});
