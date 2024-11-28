import { Coordinates } from './coordinates';

export type Navigator = NavigatorFacingNorth | NavigatorFacingSouth | NavigatorFacingWest | NavigatorFacingEast;

export class NavigatorFacingNorth {
  constructor(readonly coordinates: Coordinates) {}

  left(): Navigator {
    return new NavigatorFacingWest(this.coordinates);
  }

  right(): Navigator {
    return new NavigatorFacingEast(this.coordinates);
  }

  forward(): Navigator {
    return new NavigatorFacingNorth(this.coordinates.increaseLongitude());
  }

  currentPosition(): Coordinates {
    return this.coordinates;
  }

  formattedLocation(): string {
    return `${this.coordinates.toString()}:N`;
  }
}

export class NavigatorFacingWest {
  constructor(readonly coordinates: Coordinates) {}

  left(): Navigator {
    return new NavigatorFacingSouth(this.coordinates);
  }

  right(): Navigator {
    return new NavigatorFacingNorth(this.coordinates);
  }

  forward(): Navigator {
    return new NavigatorFacingWest(this.coordinates.decreaseLatitude());
  }

  currentPosition(): Coordinates {
    return this.coordinates;
  }

  formattedLocation(): string {
    return `${this.coordinates.toString()}:W`;
  }
}

export class NavigatorFacingSouth {
  constructor(readonly coordinates: Coordinates) {}

  left(): Navigator {
    return new NavigatorFacingEast(this.coordinates);
  }

  right(): Navigator {
    return new NavigatorFacingWest(this.coordinates);
  }

  forward(): Navigator {
    return new NavigatorFacingSouth(this.coordinates.decreaseLongitude());
  }

  currentPosition(): Coordinates {
    return this.coordinates;
  }

  formattedLocation(): string {
    return `${this.coordinates.toString()}:S`;
  }
}

export class NavigatorFacingEast {
  constructor(readonly coordinates: Coordinates) {}

  left(): Navigator {
    return new NavigatorFacingNorth(this.coordinates);
  }

  right(): Navigator {
    return new NavigatorFacingSouth(this.coordinates);
  }

  forward(): Navigator {
    return new NavigatorFacingEast(this.coordinates.increaseLatitude());
  }

  currentPosition(): Coordinates {
    return this.coordinates;
  }

  formattedLocation(): string {
    return `${this.coordinates.toString()}:E`;
  }
}
