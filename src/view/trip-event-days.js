import AbstractView from "./abstract.js";

const createTripDaysTemplate = () => {

  return `<ul class="trip-days"></ul>`;
};

export default class TripEventDays extends AbstractView {
  get template() {
    return createTripDaysTemplate();
  }
}
