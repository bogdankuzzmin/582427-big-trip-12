import randomId from "random-id";
import DestinationModel from "../model/destination.js";
import EventModel from "../model/events.js";

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSyncRequired = false;
  }

  get isSyncRequired() {
    return this._isSyncRequired;
  }

  set isSyncRequired(value) {
    this._isSyncRequired = value;
    this._store.setSyncFlag(value);
  }

  getDestinations() {
    if (Provider.isOnline()) {
      return this._api.getDestinations()
         .then((destinations) => {
           const items = destinations.map(DestinationModel.adaptToServer);

           this._store.setDestinations(items);
           return destinations;
         });
    }

    const storeDestinations = this._store.getDestinations();
    return Promise.resolve(storeDestinations.map(DestinationModel.adaptToClient));
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
         .then((offers) => {
           this._store.setOffers(offers);
           return offers;
         });
    }

    const storeOffers = Object.values(this._store.getOffers());

    return Promise.resolve(storeOffers);
  }

  getEvents() {
    if (Provider.isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events.map(EventModel.adaptToServer));
          this._store.setEvents(items);
          return events;
        });
    }

    const storeEvents = Object.values(this._store.getEvents());
    return Promise.resolve(storeEvents.map(EventModel.adaptToClient));
  }

  updateEvent(event) {
    if (Provider.isOnline()) {
      return this._api.updateEvent(event)
        .then((updatedEvent) => {
          this._store.setEvent(updatedEvent.id, EventModel.adaptToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._store.setEvent(event.id, EventModel.adaptToServer(Object.assign({}, event)));
    this.isSyncRequired = true;

    return Promise.resolve(event);
  }

  addEvent(event) {
    if (Provider.isOnline()) {
      return this._api.addEvent(event)
        .then((newEvent) => {
          this._store.setEvent(newEvent.id, EventModel.adaptToServer(newEvent));
          return newEvent;
        });
    }

    const localNewEventId = randomId();
    const localNewEvent = Object.assign({}, event, {id: localNewEventId});

    this._store.setEvent(localNewEvent.id, EventModel.adaptToServer(localNewEvent));
    this.isSyncRequired = true;

    return Promise.resolve(localNewEvent);
  }

  deleteEvent(event) {
    if (Provider.isOnline()) {
      return this._api.deleteEvent(event)
        .then(() => this._store.removeEvent(event.id));
    }

    this._store.removeEvent(event.id);
    this.isSyncRequired = true;

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storeEvents = Object.values(this._store.getEvents());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEvents = getSyncedEvents(response.created);
          const updatedEvents = getSyncedEvents(response.updated);
          const items = createStoreStructure([...createdEvents, ...updatedEvents]);
          this.isSyncRequired = true;
          this._store.getEvents(items);

          return Object.values(items);
        })
          .then((events) => events.map(EventModel.adaptToClient));
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
