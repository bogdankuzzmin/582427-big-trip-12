import moment from "moment";
import he from "he";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

import {EVENT_ACTION} from "../const.js";
import {getPrepositon, getOffers} from "../utils/event.js";
import {capitalizeFirstLetter} from "../utils/common.js";
import SmartView from "./smart.js";

const BLANK_EVENT = {
  type: `taxi`,
  price: 0,
  offers: [],
  destination: {
    city: ``,
  },
  startDate: new Date(),
  endDate: new Date(),
  isFavorite: false,
};

const ButtonCondition = {
  SAVE: `Save`,
  SAVING: `Saving...`,
  DELETE: `Delete`,
  DELETING: `Deleting...`,
  CANCEL: `Cancel`,
};

const createListOffersTemplate = (offers, isChecked) => {
  if (offers === null || offers.length === 0) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${offers
        .map((offer) => createNewOfferTemplate(
            offer,
            isChecked.some((it) => it.title === offer.title)
        )).join(``)}
    </div>`
  );
};

const createNewOfferTemplate = (offer, isChecked) => {
  const offerNameId = offer.title.split(` `).join(`-`).toLowerCase();

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
        id="event-offer-${offerNameId}"
        type="checkbox" name="event-offer-${offerNameId}"
        ${isChecked ? `checked` : ``}
        value="${offer.title}">

      <label class="event__offer-label" for="event-offer-${offerNameId}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

const createDestinationTemplate = (event) => {
  if (event.destination === null || event.destination.length === 0 || !event.destination.description || !event.destination.photos) {
    return ``;
  }

  return (
    `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">
        ${event.destination.description}
      </p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${event.destination.photos.map((photoURL) =>
      (`<img class="event__photo" src="${photoURL.src}" alt="${photoURL.description}">`))
      .join(``)}
      </div>
    </div>`
  );
};

const createFavoriteInputTemplate = (event) => {
  if (!event.id) {
    return ``;
  }

  return (
    `<input class="event__favorite-checkbox  visually-hidden"
      id="event-${event.id}"
      type="checkbox"
      name="event-favorite"
      ${event.isFavorite ? `checked` : ``}>

      <label class="event__favorite-btn" for="event-${event.id}">
      <span class="visually-hidden">Add to favorite</span>

      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>`
  );
};

const createRollupButtonTemplate = (event) => {
  if (!event.id) {
    return ``;
  }

  return (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`
  );

};

const createTypeItemTemplate = (action, currentType) => {
  return action
    .map((actionType) => {
      const lowCaseType = actionType.toLowerCase();

      return (
        `<div class="event__type-item">
          <input class="event__type-input
            visually-hidden" type="radio"
            name="event-type"
            id="event-type-${lowCaseType}-1"
            value="${lowCaseType}" ${currentType === lowCaseType ? `checked` : ``}>

          <label class="event__type-label event__type-label--${lowCaseType}"
            data-type="${lowCaseType}"
            for="event-type-${lowCaseType}-1">
            ${actionType}
          </label>
        </div>`
      );
    }).join(``);
};

const createDestinationItemTemplate = (destinations) => {
  return destinations.map((destination) => {
    return `<option value="${destination.city}"></option>`;
  }).join(``);
};

const createNewEventTemplate = (events, destinations, offers) => {
  const {type, price, startDate, endDate, destination, isDisabled, isSaving, isDeleting} = events;

  const city = destination.city;
  const actionPreposition = getPrepositon(type);
  const actionTypeTemplate = createTypeItemTemplate(EVENT_ACTION.types, type);
  const ationActivityTemplate = createTypeItemTemplate(EVENT_ACTION.activities, type);
  const destinationTemplate = createDestinationTemplate(events);
  const favoriteInputTemplate = createFavoriteInputTemplate(events);
  const rollupButtonTemplate = createRollupButtonTemplate(events);

  const listOffersTemplate = createListOffersTemplate(getOffers(offers, type), events.offers);
  const isDescription = destinations.description === destination.description;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? `disabled` : ``}>

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
            ${capitalizeFirstLetter(type)} ${actionPreposition}
          </label>

          <input class="event__input  event__input--destination"
            id="event-destination-1" type="text"
            name="event-destination"
            value="${he.encode(city)}"
            list="destination-list-1" ${isDisabled ? `disabled` : ``}>

          <datalist id="destination-list-1">
            ${createDestinationItemTemplate(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>

          <input class="event__input  event__input--time"
            id="event-start-time"
            type="text"
            name="event-start-time"
            value="${moment(startDate).format(`DD/MM/YY HH:mm`)}" ${isDisabled ? `disabled` : ``}>

          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>

          <input class="event__input  event__input--time"
            id="event-end-time"
            type="text"
            name="event-end-time"
            value="${moment(endDate).format(`DD/MM/YY HH:mm`)}" ${isDisabled ? `disabled` : ``}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price"
            id="event-price-1"
            type="number"
            name="event-price"
            value="${price}" ${isDisabled ? `disabled` : ``}>
        </div>

        <button class="event__save-btn  btn  btn--blue"
          type="submit"
          ${isDisabled || isDescription ? `disabled` : ``}>
          ${isSaving ? `${ButtonCondition.SAVING}` : `${ButtonCondition.SAVE}`}
        </button>

        <button class="event__reset-btn"
          type="reset"
          ${isDisabled ? `disabled` : ``}>
          ${events.id ? `${isDeleting ? `${ButtonCondition.DELETING}` : `${ButtonCondition.DELETE}`}` : `${ButtonCondition.CANCEL}`}
        </button>

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

export default class NewEvent extends SmartView {
  constructor(destination, events, offers) {
    super();

    this._destination = destination;
    this._offers = offers;
    this._data = events || BLANK_EVENT;
    this._sourcedData = events;
    this._datepicker = {
      start: null,
      end: null,
    };

    this._editEventClickHandler = this._editEventClickHandler.bind(this);
    this._formEventSubmitHandler = this._formEventSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._typeClickHandler = this._typeClickHandler.bind(this);
    this._destinationCliclHandler = this._destinationCliclHandler.bind(this);
    this._dateChangeHandler = this._dateChangeHandler.bind(this);
    this._offerClickHandler = this._offerClickHandler.bind(this);
    this.resetFormState = this.resetFormState.bind(this);

    this._setInnerHandlers();
    this._setDatePicker();
  }

  get template() {
    return createNewEventTemplate(this._data, this._destination, this._offers);
  }

  removeElement() {
    super.removeElement();

    Object.values(this._datepicker)
      .forEach((oneDatepicker) => {
        if (oneDatepicker) {
          oneDatepicker.destroy();
          oneDatepicker = null;
        }
      });
  }

  reset(event) {
    this.updateData(event);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePicker();
    this.setFormEventSubmitHandler(this._callback.formEventSubmit);
    this.setFormDeleteClickHandler(this._callback.deleteClick);

    if (this._callback.favoriteClick) {
      this.setFavoriteClickHandler(this._callback.favoriteClick);
    }

    if (this._callback.editEventClick) {
      this.setEditEventClickHandler(this._callback.editEventClick);
    }
  }

  _setInnerHandlers() {
    this.element
      .querySelector(`.event__input--price`)
      .addEventListener(`input`, this._priceInputHandler);
    this.element
      .querySelector(`.event__type-list`)
      .addEventListener(`click`, this._typeClickHandler);
    this.element
      .querySelector(`.event__input--destination`)
      .addEventListener(`input`, this._destinationCliclHandler);
  }

  _setDatePicker() {
    const datapicker = Object.entries(this._datepicker);

    for (const onePick of datapicker) {
      const onePickKeys = onePick[0];
      let onePickValues = onePick[1];

      if (onePickValues) {
        onePickValues.destroy();
        onePickValues = null;
      }

      this._datepicker[onePickKeys] = flatpickr(
          this.element.querySelector(`#event-${onePickKeys}-time`),
          {
            dateFormat: `d/m/y H:i`,
            enableTime: true,
            defaultDate: this._data[`${onePickKeys}Date`],
            minDate: onePickKeys === `end` ? this._data.startDate : null,
            maxDate: onePickKeys === `start` ? this._data.endDate : null,
            onChange: (evt) => this._dateChangeHandler(evt, `${onePickKeys}Date`),
          }
      );
    }
  }

  _typeClickHandler(evt) {
    evt.preventDefault();

    const type = evt.target.dataset.type;

    if (evt.target.dataset.type === this._data.type) {
      this.element.querySelector(`.event__type-btn`).click();
      return;
    }

    this.updateData({
      type,
    });
  }

  _destinationCliclHandler(evt) {
    evt.preventDefault();

    const targetCity = evt.target.value;

    const findCity = this._destination.find((it) => it.city === targetCity);
    const destination = findCity ? findCity : {city: targetCity};
    const isRender = destination.description === this._data.destination.description;

    this.updateData({
      destination,
    }, isRender);

  }

  _dateChangeHandler([selectedDate], keyDate) {
    this.updateData({
      [`${keyDate}`]: selectedDate,
    }, true);

    this._datepicker.start.set(`maxDate`, this._data.endDate);
    this._datepicker.end.set(`minDate`, this._data.startDate);
  }

  _priceInputHandler(evt) {
    evt.preventDefault();

    this.updateData({
      price: Number(evt.target.value),
    }, true);
  }

  _offerClickHandler() {
    const checkedTitles = Array
      .from(this.element.querySelectorAll(`.event__offer-checkbox`))
      .filter((element) => element.checked)
      .map((element) => element.value);

    const offers = getOffers(this._offers, this._data.type)
                    .filter((offer) => checkedTitles.includes(offer.title));


    this.updateData({
      offers,
    }, true);

  }

  _editEventClickHandler(evt) {
    evt.preventDefault();
    this.reset(this._sourcedData);
    this._callback.editEventClick();
  }

  resetFormState() {
    this.updateData({
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    });
  }

  shakeForm() {
    this.shake(this.resetFormState);
  }

  _formEventSubmitHandler(evt) {
    evt.preventDefault();
    this._offerClickHandler();
    this._callback.formEventSubmit(this._data);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  setEditEventClickHandler(callback) {
    this._callback.editEventClick = callback;
    this.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editEventClickHandler);
  }

  setFormEventSubmitHandler(callback) {
    this._callback.formEventSubmit = callback;
    this.element.addEventListener(`submit`, this._formEventSubmitHandler);
  }

  setFormDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.element.querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.element.querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
