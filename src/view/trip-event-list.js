import AbstractView from "./abstract.js";

const createDayInfoTemplate = (dayId, eventDate) => {
  if (dayId === null || eventDate === null) {
    dayId = ``;
    eventDate = () => ``;
  }

  return (
    `<div class="day__info">
      <span class="day__counter">${dayId}</span>
      <time class="day__date" datetime="${eventDate(`YYYY-MM-DD`)}">${eventDate(`MMM DD`)}</time>
    </div>`
  );

};

const createTripListTemplate = (dayId, eventDate) => {
  return (
    `<li class="trip-days__item  day">
        ${createDayInfoTemplate(dayId, eventDate)}
        <ul class="trip-events__list">

        </ul>
      </li>`
  );
};

export default class TripEventList extends AbstractView {
  constructor(dayId, eventDate) {
    super();

    this._dayId = dayId;
    this._eventDate = eventDate;
  }

  get template() {
    return createTripListTemplate(this._dayId, this._eventDate);
  }
}
