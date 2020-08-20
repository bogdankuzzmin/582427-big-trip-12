import AbstractView from "./abstract.js";

const createTripListTemplate = (dayId, eventDate) => {
  return (
    `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${dayId}</span>
          <time class="day__date" datetime="${eventDate(`YYYY-MM-DD`)}">${eventDate(`MMM DD`)}</time>
        </div>

        <ul class="trip-events__list">

        </ul>
      </li>`
  );
};

export default class TripList extends AbstractView {
  constructor(dayId, eventDate) {
    super();

    this._dayId = dayId;
    this._eventDate = eventDate;
  }

  get template() {
    return createTripListTemplate(this._dayId, this._eventDate);
  }
}
