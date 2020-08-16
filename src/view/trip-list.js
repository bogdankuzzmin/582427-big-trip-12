import {createElement} from "../utils.js";
import {createTripWayPointTemplate} from "../view/trip-waypoint.js";

const createEventPointsTemplate = (events) => {
  return events
    .map((event) => createTripWayPointTemplate(event))
    .join(``);
};


const createTripListTemplate = (dayId, eventDate, event) => {

  return (
    `<ul class="trip-days">
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${dayId}</span>
          <time class="day__date" datetime="${eventDate(`YYYY-MM-DD`)}">${eventDate(`MMM DD`)}</time>
        </div>

        <ul class="trip-events__list">
          ${createEventPointsTemplate(event)}
        </ul>
      </li>
    </ul>`
  );
};

export default class TripList {
  constructor(dayId, eventDate, event) {
    this._dayId = dayId;
    this._eventDate = eventDate;
    this._event = event;
    this._element = null;
  }

  get template() {
    return createTripListTemplate(this._dayId, this._eventDate, this._event);
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this.template);
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
