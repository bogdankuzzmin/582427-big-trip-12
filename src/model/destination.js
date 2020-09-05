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
}
