import EventModel from "./model/events.js";
import DestinationModel from "./model/destination.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

const DataUrl = {
  EVENTS: `points`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEvents() {
    return this._load({url: DataUrl.EVENTS})
      .then(Api.toJSON)
      .then((events) => events.map(EventModel.adaptToClient));
  }

  getDestinations() {
    return this._load({url: DataUrl.DESTINATIONS})
      .then(Api.toJSON)
      .then((destinations) => destinations.map(DestinationModel.adaptToClient));
  }

  getOffers() {
    return this._load({url: DataUrl.OFFERS})
      .then(Api.toJSON);
  }

  updateEvent(event) {
    return this._load({
      url: `${DataUrl.EVENTS}/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(EventModel.adaptToServer(event)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(EventModel.adaptToClient);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
