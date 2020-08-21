import moment from "moment";
import {render, replace} from "../utils/render.js";
import {separateEventsIntoDays} from "../utils/event.js";
import {InsertPosition} from "../const.js";

import TripListView from "../view/trip-list.js";
import TripDaysView from "../view/trip-days.js";
import NoPointsView from "../view/no-points.js";
import SortView from "../view/sort.js";
import TripWaypointView from "../view/trip-waypoint.js";
import NewEventView from "../view/new-event.js";

export default class Trip {
  constructor(tripBlockContainer) {
    this._tripBlockContainer = tripBlockContainer;

    this._tripDaysComponent = new TripDaysView();
    this._sortComponent = new SortView();
    this._noPointsComponent = new NoPointsView();
  }

  init(tripBlockDestination, tripBlockEvents) {
    this._tripBlockEvents = tripBlockEvents.slice();
    this._tripBlockDestination = tripBlockDestination;

    this._renderEvents();
  }

  _renderEvents() {
    if (this._tripBlockEvents.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderTripDays();
    this._renderDays();
  }

  _renderNoPoints() {
    render(this._tripBlockContainer, this._noPointsComponent, InsertPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._tripBlockContainer, this._sortComponent, InsertPosition.BEFOREEND);
  }

  _renderTripDays() {
    render(this._tripBlockContainer, this._tripDaysComponent, InsertPosition.BEFOREEND);
  }

  _renderDays() {
    const tripDays = this._tripBlockContainer.querySelector(`.trip-days`);
    const groupSeparatedEvents = separateEventsIntoDays(this._tripBlockEvents);

    Object.keys(groupSeparatedEvents).forEach((oneDay, dayId) => {
      const eventDay = (formatDate) => moment(oneDay).format(formatDate);
      const tripListComponent = new TripListView(dayId + 1, eventDay, groupSeparatedEvents[oneDay]).element;

      render(tripDays, tripListComponent, InsertPosition.BEFOREEND);

      groupSeparatedEvents[oneDay].forEach((event) => {
        this._renderEvent(tripListComponent, event);
      });
    });
  }

  _renderEvent(tripEventList, event) {
    const tripEventListContainer = tripEventList.querySelector(`.trip-events__list`);

    const eventComponent = new TripWaypointView(event);
    const taskEditComponent = new NewEventView(this._tripBlockDestination, event);

    const replaceWaypoinToEdit = () => {
      replace(taskEditComponent, eventComponent);
    };

    const replaceEditToWaypoint = () => {
      replace(eventComponent, taskEditComponent);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceEditToWaypoint();

        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };

    eventComponent.setEventClickHandler(() => {
      replaceWaypoinToEdit();
      document.addEventListener(`keydown`, escKeyDownHandler);
    });

    taskEditComponent.setEditEventClickHandler(() => {
      replaceEditToWaypoint();
      document.removeEventListener(`keydown`, escKeyDownHandler);
    });

    taskEditComponent.setFormEventSubmitHandler(() => {
      replaceEditToWaypoint();
      document.removeEventListener(`keydown`, escKeyDownHandler);
    });

    render(tripEventListContainer, eventComponent, InsertPosition.BEFOREEND);
  }
}
