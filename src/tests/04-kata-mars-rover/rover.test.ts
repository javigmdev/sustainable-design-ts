import { Coordinates } from '../../core/04-kata-mars-rover/coordinates';
import { NavigatorFacingNorth } from '../../core/04-kata-mars-rover/navigator';
import { Rover } from '../../core/04-kata-mars-rover/rover';

describe('The Mars Rover', () => {
  it.each([
    ['L', '0:0:W'],
    ['R', '0:0:E'],
    ['F', '0:1:N'],
    ['FF', '0:2:N'],
    ['RFF', '2:0:E'],
    ['LFF', '8:0:W'],
    ['LLFF', '0:8:S'],
    ['FRFFR', '2:1:S'],
  ])(
    'generates the expected formatted location after executes the given raw commands: (%s)',
    (rawCommands, expectedLocation) => {
      const coordinates = Coordinates.create(0, 0);
      const navigator = new NavigatorFacingNorth(coordinates);
      const rover = new Rover(navigator);

      expect(rover.run(rawCommands)).toBe(expectedLocation);
    }
  );

  it('does not allow a given invalid raw commands', () => {
    const coordinates = Coordinates.create(0, 0);
    const navigator = new NavigatorFacingNorth(coordinates);
    const rover = new Rover(navigator);

    expect(() => rover.run('A')).toThrow('Invalid Command');
    expect(() => rover.run('')).toThrow('Invalid Command');
    expect(() => rover.run(null)).toThrow('Invalid Command');
  });
});
