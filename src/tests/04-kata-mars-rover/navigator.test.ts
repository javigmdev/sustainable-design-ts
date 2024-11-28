import { Coordinates } from '../../core/04-kata-mars-rover/coordinates';
import {
  NavigatorFacingEast,
  NavigatorFacingNorth,
  NavigatorFacingSouth,
  NavigatorFacingWest,
} from '../../core/04-kata-mars-rover/navigator';

describe('The Navigator', () => {
  describe('when facing North', () => {
    it('should have West to the left', () => {
      const navigator = new NavigatorFacingNorth(Coordinates.create(0, 0));
      expect(navigator.left()).toBeInstanceOf(NavigatorFacingWest);
    });

    it('should have East to the right', () => {
      const navigator = new NavigatorFacingNorth(Coordinates.create(0, 0));
      expect(navigator.right()).toBeInstanceOf(NavigatorFacingEast);
    });

    it('should continue in North when moving forward', () => {
      const navigator = new NavigatorFacingNorth(Coordinates.create(0, 0));
      expect(navigator.forward()).toBeInstanceOf(NavigatorFacingNorth);
    });

    it('should increase latitude when moving forward', () => {
      const navigator = new NavigatorFacingNorth(Coordinates.create(0, 0));
      expect(navigator.forward().currentPosition()).toEqual(Coordinates.create(0, 1));
    });
  });

  describe('when facing South', () => {
    it('should have East to the left', () => {
      const navigator = new NavigatorFacingSouth(Coordinates.create(0, 0));
      expect(navigator.left()).toBeInstanceOf(NavigatorFacingEast);
    });

    it('should have West to the right', () => {
      const navigator = new NavigatorFacingSouth(Coordinates.create(0, 0));
      expect(navigator.right()).toBeInstanceOf(NavigatorFacingWest);
    });

    it('should continue in south when moving forward', () => {
      const navigator = new NavigatorFacingSouth(Coordinates.create(0, 0));
      expect(navigator.forward()).toBeInstanceOf(NavigatorFacingSouth);
    });

    it('should decrease latitude when moving forward', () => {
      const navigator = new NavigatorFacingSouth(Coordinates.create(0, 2));
      expect(navigator.forward().currentPosition()).toEqual(Coordinates.create(0, 1));
    });
  });

  describe('when facing East', () => {
    it('should have North to the left', () => {
      const east = new NavigatorFacingEast(Coordinates.create(0, 0));
      expect(east.left()).toBeInstanceOf(NavigatorFacingNorth);
    });

    it('should have South to the right', () => {
      const east = new NavigatorFacingEast(Coordinates.create(0, 0));
      expect(east.right()).toBeInstanceOf(NavigatorFacingSouth);
    });

    it('should continue in East when moving forward', () => {
      const east = new NavigatorFacingEast(Coordinates.create(0, 0));
      expect(east.forward()).toBeInstanceOf(NavigatorFacingEast);
    });

    it('should increase longitude when moving forward', () => {
      const east = new NavigatorFacingEast(Coordinates.create(0, 0));
      expect(east.forward().currentPosition()).toEqual(Coordinates.create(1, 0));
    });
  });

  describe('when facing West', () => {
    it('should have South to the left', () => {
      const west = new NavigatorFacingWest(Coordinates.create(0, 0));
      expect(west.left()).toBeInstanceOf(NavigatorFacingSouth);
    });

    it('should have North to the right', () => {
      const west = new NavigatorFacingWest(Coordinates.create(0, 0));
      expect(west.right()).toBeInstanceOf(NavigatorFacingNorth);
    });

    it('should continue in West when moving forward', () => {
      const west = new NavigatorFacingWest(Coordinates.create(0, 0));
      expect(west.forward()).toBeInstanceOf(NavigatorFacingWest);
    });

    it('should decrease longitude when moving forward', () => {
      const west = new NavigatorFacingWest(Coordinates.create(2, 0));
      expect(west.forward().currentPosition()).toEqual(Coordinates.create(1, 0));
    });
  });
});
