import moment from "moment";
import {EVENT_ACTION} from "../const.js";
import AbstractView from "./abstract.js";

const createListOffersTemplate = (offers) => {
  if (offers === null || offers.length === 0) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${createNewOfferTemplate(offers)}
    </div>`
  );
};

const createNewOfferTemplate = (offers) => {
  return offers.map((offer) => {
    const offerNameId = offer.name.split(` `).join(`-`).toLowerCase();

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerNameId}" type="checkbox" name="event-offer-${offerNameId}" ${offer.isChecked ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${offerNameId}">
          <span class="event__offer-title">${offer.name}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
    );
  }).join(``);
};

const createDestinationTemplate = (destination, event) => {
  if (destination === null || destination.length === 0) {
    destination = {
      description: `Here is no description.`,
      photos: [`http://picsum.photos/248/152?r=0.01810293968388854`],
    };
  }

  if (event.eventId) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">
        ${destination.description}
      </p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${destination.photos.map((photoURL) =>
      (`<img class="event__photo" src="${photoURL}" alt="Event photo">`))
      .join(``)}
      </div>
    </div>`
  );
};

const createFavoriteInputTemplate = (event) => {
  return (
    `<input id="event-${event.eventId}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${event.isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-${event.eventId}">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const createRollupButtonTemplate = (event) => {
  if (event.eventId) {
    return (
      `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
    );
  }

  return ``;
};

const createTypeItemTemplate = (action, countStart = 0, countEnd = 7) => {
  return action.types
    .slice(countStart, countEnd)
    .map((actionType) => {
      const lowCaseType = actionType.toLowerCase();

      return (
        `<div class="event__type-item">
          <input id="event-type-${lowCaseType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
          value="${lowCaseType}">
          <label class="event__type-label  event__type-label--${lowCaseType}" for="event-type-${lowCaseType}-1">${actionType}</label>
        </div>`
      );
    }).join(``);
};

const BLANK_EVENT = {
  action: {
    preposition: `to`,
    type: `Taxi`,
  },
  city: ``,
  price: ``,
  actionType: createTypeItemTemplate(EVENT_ACTION),
  ationActivity: createTypeItemTemplate(EVENT_ACTION, 7, EVENT_ACTION.types.length),
  offers: [],
  startTime: new Date(),
  endTime: new Date(),
  isFavorite: true,
};

const createNewEventTemplate = (destination, events) => {
  const {action, city, price, startDate, endDate} = events;

  const actionType = action.type;
  const typeInLowerCase = actionType.toLowerCase();
  const actionPreposition = action.preposition;
  const actionTypeTemplate = createTypeItemTemplate(EVENT_ACTION);
  const ationActivityTemplate = createTypeItemTemplate(EVENT_ACTION, 7, EVENT_ACTION.types.length);
  const listOffersTemplate = createListOffersTemplate(events.offers);
  const destinationTemplate = createDestinationTemplate(destination, events);
  const favoriteInputTemplate = createFavoriteInputTemplate(events);
  const rollupButtonTemplate = createRollupButtonTemplate(events);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${typeInLowerCase}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${actionTypeTemplate}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${ationActivityTemplate}
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${actionType} ${actionPreposition}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
            <option value="Saint Petersburg"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${moment(startDate).format(`DD/MM/YY HH:mm`)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${moment(endDate).format(`DD/MM/YY HH:mm`)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${events.eventId ? `Delete` : `Cancel`}</button>

        ${favoriteInputTemplate}
        ${rollupButtonTemplate}

      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          ${listOffersTemplate}
        </section>

        <section class="event__section  event__section--destination">
          ${destinationTemplate}
        </section>
      </section>
    </form>`
  );
};

export default class NewEvent extends AbstractView {
  constructor(destination, events) {
    super();

    this._destination = destination;
    this._events = events || BLANK_EVENT;
    this._editEventClickHandler = this._editEventClickHandler.bind(this);
    this._formEventSubmitHandler = this._formEventSubmitHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  get template() {
    return createNewEventTemplate(this._destination, this._events);
  }

  _editEventClickHandler(evt) {
    evt.preventDefault();
    this._callback.editEventClick();
  }

  _formEventSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formEventSubmit();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setEditEventClickHandler(callback) {
    this._callback.editEventClick = callback;
    this.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editEventClickHandler);
  }

  setFormEventSubmitHandler(callback) {
    this._callback.formEventSubmit = callback;
    this.element.addEventListener(`submit`, this._formEventSubmitHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.element.querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
