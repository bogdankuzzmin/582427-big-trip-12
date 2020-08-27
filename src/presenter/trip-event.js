import TripEventView from "../view/trip-event.js";
import TripEventEditView from "../view/new-event.js";
import {render, replace, remove} from "../utils/render.js";
import {InsertPosition} from "../const.js";

export default class TripEvent {
  constructor(tripEventsListContainer) {
    this._tripEventsListContainer = tripEventsListContainer;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;

    this._handleEventClick = this._handleEventClick.bind(this);
    this._handleEditEventClick = this._handleEditEventClick.bind(this);
    this._handleFormEventSubmit = this._handleFormEventSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(destination, event) {
    this._event = event;

    this._tripEventComponent = new TripEventView(event);
    this._tripEventEditComponent = new TripEventEditView(destination, event);

    this._tripEventComponent.setEventClickHandler(this._handleEventClick);
    this._tripEventEditComponent.setEditEventClickHandler(this._handleEditEventClick);
    this._tripEventEditComponent.setFormEventSubmitHandler(this._handleFormEventSubmit);

    render(this._tripEventsListContainer, this._tripEventComponent, InsertPosition.BEFOREEND);
  }

  _replaceTripEventToEdit() {
    replace(this._tripEventEditComponent, this._tripEventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceEditToTripEvent() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceEditToTripEvent();

      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _handleEventClick() {
    this._replaceTripEventToEdit();
  }

  _handleEditEventClick() {
    this._replaceEditToTripEvent();
  }

  _handleFormEventSubmit() {
    this._replaceEditToTripEvent();
  }
}
