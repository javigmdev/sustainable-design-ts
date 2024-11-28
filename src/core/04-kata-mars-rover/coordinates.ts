export class Coordinates {
  private static readonly boundaryLatitude = 10;
  private static readonly boundaryLongitude = 10;

  private constructor(
    private readonly latitude: number,
    private readonly longitude: number
  ) {}

  static create(latitude: number, longitude: number) {
    if (latitude < 0 || longitude < 0) {
      throw new Error('Negative values are not allowed');
    }
    if (latitude >= Coordinates.boundaryLatitude) {
      latitude = latitude % Coordinates.boundaryLatitude;
    }
    if (longitude >= Coordinates.boundaryLongitude) {
      longitude = longitude % Coordinates.boundaryLongitude;
    }
    return new Coordinates(latitude, longitude);
  }

  increaseLatitude() {
    return Coordinates.create(this.latitude + 1, this.longitude);
  }

  decreaseLatitude() {
    if (this.latitude === 0) {
      return Coordinates.create(Coordinates.boundaryLatitude - 1, this.longitude);
    }
    return Coordinates.create(this.latitude - 1, this.longitude);
  }

  increaseLongitude() {
    return Coordinates.create(this.latitude, this.longitude + 1);
  }

  decreaseLongitude() {
    if (this.longitude === 0) {
      return Coordinates.create(this.latitude, Coordinates.boundaryLongitude - 1);
    }
    return Coordinates.create(this.latitude, this.longitude - 1);
  }

  toString() {
    return `${this.latitude}:${this.longitude}`;
  }
}
