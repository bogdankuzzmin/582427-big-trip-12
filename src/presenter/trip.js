import moment from "moment";
import {render, replace} from "../utils/render.js";
import {separateEventsIntoDays} from "../utils/event.js";
import {InsertPosition} from "../const.js";

import TripEventListView from "../view/trip-event-list.js";
import TripEventDaysView from "../view/trip-event-days.js";
import TripNoEventsView from "../view/trip-no-events.js";
import TripSortView from "../view/trip-sort.js";
import TripEventView from "../view/trip-event.js";
import NewEventView from "../view/new-event.js";

export default class Trip {
  constructor(tripEventContainer) {
    this._tripEventContainer = tripEventContainer;

    this._tripSortComponent = new TripSortView();
    this._tripEventDaysComponent = new TripEventDaysView();
    this._tripNoEventsComponent = new TripNoEventsView();
  }

  init(destination, events) {
    this._tripEvents = events.slice();
    this._tripDestination = destination;

    this._renderEvents();
  }

  _renderEvents() {
    if (this._tripEvents.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderTripSort();
    this._renderTripEventDaysContainer();
    this._renderTripEventDays();
  }

  _renderNoPoints() {
    render(this._tripEventContainer, this._tripNoEventsComponent, InsertPosition.BEFOREEND);
  }

  _renderTripSort() {
    render(this._tripEventContainer, this._tripSortComponent, InsertPosition.BEFOREEND);
  }

  _renderTripEventDaysContainer() {
    render(this._tripEventContainer, this._tripEventDaysComponent, InsertPosition.BEFOREEND);
  }

  _renderTripEventDays() {
    const tripDays = this._tripEventContainer.querySelector(`.trip-days`);
    const groupSeparatedEvents = separateEventsIntoDays(this._tripEvents);

    Object.keys(groupSeparatedEvents).forEach((oneDay, dayId) => {
      const eventDay = (formatDate) => moment(oneDay).format(formatDate);
      const tripEventsListComponent = new TripEventListView(dayId + 1, eventDay, groupSeparatedEvents[oneDay]).element;

      render(tripDays, tripEventsListComponent, InsertPosition.BEFOREEND);

      groupSeparatedEvents[oneDay].forEach((event) => {
        this._renderEvent(tripEventsListComponent, event);
      });
    });
  }

  _renderEvent(tripEventList, event) {
    const tripEventListContainer = tripEventList.querySelector(`.trip-events__list`);

    const tripEventComponent = new TripEventView(event);
    const tripEventEditComponent = new NewEventView(this._tripDestination, event);

    const replaceTripEventToEdit = () => {
      replace(tripEventEditComponent, tripEventComponent);
    };

    const replaceEditToTripEvent = () => {
      replace(tripEventComponent, tripEventEditComponent);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceEditToTripEvent();

        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };

    tripEventComponent.setEventClickHandler(() => {
      replaceTripEventToEdit();
      document.addEventListener(`keydown`, escKeyDownHandler);
    });

    tripEventEditComponent.setEditEventClickHandler(() => {
      replaceEditToTripEvent();
      document.removeEventListener(`keydown`, escKeyDownHandler);
    });

    tripEventEditComponent.setFormEventSubmitHandler(() => {
      replaceEditToTripEvent();
      document.removeEventListener(`keydown`, escKeyDownHandler);
    });

    render(tripEventListContainer, tripEventComponent, InsertPosition.BEFOREEND);
  }
}
