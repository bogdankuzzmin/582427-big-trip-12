import Observer from "../utils/observer.js";

export default class Destination extends Observer {
  constructor() {
    super();
    this._destination = [];
  }

  setDestination(destination) {
    this._destination = destination.slice();
  }

  getDestination() {
    return this._destination;
  }

  static adaptToClient(destination) {
    const adaptDestination = Object.assign(
        {},
        destination,
        {
          city: destination.name,
          description: destination.description,
          photos: destination.pictures,
        }
    );

    delete adaptDestination.name;
    delete adaptDestination.pictures;

    return adaptDestination;
  }

  static adaptToServer(destination) {
    return {
      "name": destination.city,
      "description": destination.description,
      "pictures": destination.photos,
    };
  }
}
