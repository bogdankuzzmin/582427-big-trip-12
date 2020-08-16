import {createTripWayPointTemplate} from "../view/trip-waypoint.js";

const createEventPointsTemplate = (events) => {
  return events
    .map((event) => createTripWayPointTemplate(event))
    .join(``);
};


export const createTripListTemplate = (dayId, eventDate, event) => {

  return (
    `
    <ul class="trip-days">
      <li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${dayId}</span>
          <time class="day__date" datetime="${eventDate(`YYYY-MM-DD`)}">${eventDate(`MMM DD`)}</time>
        </div>

        <ul class="trip-events__list">
          ${createEventPointsTemplate(event)}
        </ul>
      </li>
    </ul>
    `);
};
