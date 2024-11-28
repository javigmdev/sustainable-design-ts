import { Coordinates } from '../../core/04-kata-mars-rover/coordinates';

describe('The Coordinates', () => {
  it('does not allow negative values for latitude', () => {
    expect(() => Coordinates.create(-1, 0)).toThrow('Negative values are not allowed');
  });

  it('does not allow negative values for longitude', () => {
    expect(() => Coordinates.create(0, -1)).toThrow('Negative values are not allowed');
  });

  it('wraps around latitude when reaching boundary', () => {
    const coordinates = Coordinates.create(10, 9);
    expect(coordinates).toEqual(Coordinates.create(0, 9));
  });

  it('wraps around longitude when reaching boundary', () => {
    const coordinates = Coordinates.create(9, 10);
    expect(coordinates).toEqual(Coordinates.create(9, 0));
  });

  it('increases the latitude by one', () => {
    const coordinates = Coordinates.create(0, 0);
    expect(coordinates.increaseLatitude()).toEqual(Coordinates.create(1, 0));

    const boundaryCoordinates = Coordinates.create(9, 0);
    expect(boundaryCoordinates.increaseLatitude()).toEqual(Coordinates.create(0, 0));
  });

  it('increases the longitude by one', () => {
    const coordinates = Coordinates.create(0, 0);
    expect(coordinates.increaseLongitude()).toEqual(Coordinates.create(0, 1));

    const boundaryCoordinates = Coordinates.create(0, 9);
    expect(boundaryCoordinates.increaseLongitude()).toEqual(Coordinates.create(0, 0));
  });

  it('decrease latitude by one', () => {
    const coordinates = Coordinates.create(1, 0);
    expect(coordinates.decreaseLatitude()).toEqual(Coordinates.create(0, 0));

    const boundaryCoordinates = Coordinates.create(0, 0);
    expect(boundaryCoordinates.decreaseLatitude()).toEqual(Coordinates.create(9, 0));
  });

  it('decrease longitude by one', () => {
    const coordinates = Coordinates.create(0, 1);
    expect(coordinates.decreaseLongitude()).toEqual(Coordinates.create(0, 0));

    const boundaryCoordinates = Coordinates.create(0, 0);
    expect(boundaryCoordinates.decreaseLongitude()).toEqual(Coordinates.create(0, 9));
  });
});
