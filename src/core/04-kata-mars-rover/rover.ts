import { Navigator } from './navigator';

export enum Command {
  Left = 'left',
  Right = 'right',
  Forward = 'forward',
}

export type RawCommand = 'L' | 'R' | 'F';

export class Rover {
  constructor(private navigator: Navigator) {}

  run(rawCommands: string) {
    this.ensureIsValidCommand(rawCommands);
    const commands = this.transformToCommands(rawCommands);
    this.runCommands(commands);
    return this.formattedLocation();
  }

  private transformToCommands(rawCommands: string) {
    return rawCommands.split('').map((rawCommand: RawCommand) => {
      if (rawCommand === 'L') return Command.Left;
      if (rawCommand === 'R') return Command.Right;
      if (rawCommand === 'F') return Command.Forward;
    });
  }

  private ensureIsValidCommand(rawCommands: string) {
    if (!rawCommands || !rawCommands.match(/^[LRF]+$/)) {
      throw new Error('Invalid Command');
    }
  }

  private runCommands(commands: Command[]) {
    commands.forEach(this.runSingleCommand);
    return this.formattedLocation();
  }

  private runSingleCommand = (command: Command): void => {
    this.navigator = this.navigator[command]();
    /* if (command === Command.Left) {
      this.navigator = this.navigator.left();
    }
    if (command === Command.Right) {
      this.navigator = this.navigator.right();
    }
    if (command === Command.Forward) {
      this.navigator = this.navigator.forward();
    }*/
  };

  private formattedLocation() {
    return this.navigator.formattedLocation();
  }
}
