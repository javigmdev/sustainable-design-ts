import { BowlingGame } from '../../core/01-kata-bowling/bowlingGame';

describe('The Bowling Game', () => {
  let game: BowlingGame;

  beforeEach(() => {
    game = new BowlingGame();
  });

  it('calculates the score for a given gutter game', () => {
    rollMany(20, 0);

    expect(game.calculateTotalScore()).toBe(0);
  });

  it('calculates the score for a given all ones game', () => {
    rollMany(20, 1);

    expect(game.calculateTotalScore()).toBe(20);
  });

  it('calculates the score for a given spare and extra ball', () => {
    rollSpare();
    game.roll(5);
    rollMany(17, 0);

    expect(game.calculateTotalScore()).toBe(20);
  });

  it('calculates the score for a given strike and some extra ball', () => {
    rollStrike();
    game.roll(2);
    game.roll(3);
    rollMany(16, 0);

    expect(game.calculateTotalScore()).toBe(20);
  });

  it('calculates the score for a given perfect game', () => {
    rollMany(12, 10);

    expect(game.calculateTotalScore()).toBe(300);
  });

  it('calculates the score for a given all 5-5 spares game', () => {
    Array.from({ length: 10 }).forEach(rollSpare);
    game.roll(5);

    expect(game.calculateTotalScore()).toBe(150);
  });

  it('calculates the score for a given all 8-2 spares game', () => {
    Array.from({ length: 10 }).forEach(() => {
      game.roll(8);
      game.roll(2);
    });
    game.roll(8);

    expect(game.calculateTotalScore()).toBe(180);
  });

  function rollStrike() {
    game.roll(10);
  }

  function rollSpare() {
    game.roll(5);
    game.roll(5);
  }

  function rollMany(length: number, pins: number) {
    Array.from({ length }).forEach((_) => game.roll(pins));
  }
});
