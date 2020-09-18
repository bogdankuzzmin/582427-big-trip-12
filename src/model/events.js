import Observer from "../utils/observer.js";

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();

    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1),
    ];

    this._notify(updateType);
  }

  setError(updateType) {
    this._notify(updateType);
  }

  static adaptToClient(event) {
    const adaptEvent = Object.assign(
        {},
        event,
        {
          price: event.base_price,
          startDate: new Date(event.date_from),
          endDate: new Date(event.date_to),
          isFavorite: event.is_favorite,
          destination: {
            city: event.destination.name,
            description: event.destination.description,
            photos: event.destination.pictures,
          },
          offers: event.offers,
        }
    );

    delete adaptEvent.base_price;
    delete adaptEvent.date_from;
    delete adaptEvent.date_to;
    delete adaptEvent.is_favorite;

    return adaptEvent;
  }

  static adaptToServer(event) {
    const adaptEvent = Object.assign(
        {},
        event,
        {
          "base_price": event.price,
          "date_from": event.startDate instanceof Date ? event.startDate.toISOString() : null,
          "date_to": event.endDate instanceof Date ? event.endDate.toISOString() : null,
          "is_favorite": event.isFavorite,
          "destination": {
            name: event.destination.city,
            description: event.destination.description,
            pictures: event.destination.photos,
          },
          "offers": event.offers,
        }
    );

    delete adaptEvent.price;
    delete adaptEvent.startDate;
    delete adaptEvent.endDate;
    delete adaptEvent.isFavorite;

    return adaptEvent;
  }
}
