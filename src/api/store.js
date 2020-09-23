const Key = {
  EVENTS: `points`,
  OFFERS: `offers`,
  DESTINATIONS: `destinations`,
};

export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getEvents() {
    return this._getItems()[Key.EVENTS];
  }

  getDestinations() {
    return this._getItems()[Key.DESTINATIONS];
  }

  getOffers() {
    return this._getItems()[Key.OFFERS];
  }

  setEvent(id, event) {
    const storedEvents = this.getEvents();

    this.setEvents(Object.assign({}, storedEvents, {
      [id]: event,
    }));
  }

  setEvents(events) {
    this._setItem(Key.EVENTS, events);
  }

  setOffers(offers) {
    this._setItem(Key.OFFERS, offers);
  }

  setDestinations(destinations) {
    this._setItem(Key.DESTINATIONS, destinations);
  }

  removeEvent(id) {
    const storedEvents = this.getEvents();
    delete storedEvents[id];
    this.setEvents(storedEvents);
  }

  _setItem(key, value) {
    const store = this._getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value,
            })
        )
    );
  }

  _getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }
}
