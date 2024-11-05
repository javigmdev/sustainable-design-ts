export type Score = {
  totalScore: number;
  frameIndex: number;
};

export class BowlingGame {
  private rolls: number[] = [];
  private readonly maxScorePerFrame = 10;

  roll(pins: number) {
    this.rolls.push(pins);
  }

  calculateTotalScore() {
    const score = this.frames().reduce(this.calculateScorePerFrame, { totalScore: 0, frameIndex: 0 });
    return score.totalScore;
  }

  private calculateScorePerFrame = ({ totalScore, frameIndex }: Score) => {
    if (this.isStrike(frameIndex)) {
      return {
        totalScore: totalScore + this.maxScorePerFrame + this.strikeBonus(frameIndex),
        frameIndex: frameIndex + 1,
      };
    }

    if (this.isSpare(frameIndex)) {
      return {
        totalScore: totalScore + this.maxScorePerFrame + this.spareBonus(frameIndex),
        frameIndex: frameIndex + 2,
      };
    }
    return {
      totalScore: totalScore + this.sumOfBallsInFrame(frameIndex),
      frameIndex: frameIndex + 2,
    };
  };

  private isSpare(frameIndex: number) {
    return this.rolls[frameIndex] + this.rolls[frameIndex + 1] == this.maxScorePerFrame;
  }

  private isStrike(frameIndex: number) {
    return this.rolls[frameIndex] == this.maxScorePerFrame;
  }

  private spareBonus(frameIndex: number) {
    return this.rolls[frameIndex + 2];
  }

  private strikeBonus(frameIndex: number) {
    return this.rolls[frameIndex + 1] + this.rolls[frameIndex + 2];
  }

  private sumOfBallsInFrame(frameIndex: number) {
    return this.rolls[frameIndex] + this.rolls[frameIndex + 1];
  }

  private frames() {
    const numberOfFrames = 10;
    return Array.from({ length: numberOfFrames }).map((_, i) => i);
  }
}
