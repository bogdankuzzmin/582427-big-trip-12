import TripEventView from "../view/trip-event.js";
import TripEventEditView from "../view/new-event.js";
import {render, replace, remove} from "../utils/render.js";
import {InsertPosition, UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class TripEvent {
  constructor(tripEventsListContainer, changeData, changeMode) {
    this._tripEventsListContainer = tripEventsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEventClick = this._handleEventClick.bind(this);
    this._handleEditEventClick = this._handleEditEventClick.bind(this);
    this._handleFormEventSubmit = this._handleFormEventSubmit.bind(this);
    this._handlerFavoriteClick = this._handlerFavoriteClick.bind(this);
    this._handleFormDeleteClick = this._handleFormDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(destination, event, offers) {
    this._events = event;

    const prevTripEventComponent = this._tripEventComponent;
    const prevTripEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventView(event);
    this._tripEventEditComponent = new TripEventEditView(destination, event, offers);

    this._tripEventComponent.setEventClickHandler(this._handleEventClick);
    this._tripEventEditComponent.setEditEventClickHandler(this._handleEditEventClick);
    this._tripEventEditComponent.setFormEventSubmitHandler(this._handleFormEventSubmit);
    this._tripEventEditComponent.setFavoriteClickHandler(this._handlerFavoriteClick);
    this._tripEventEditComponent.setFormDeleteClickHandler(this._handleFormDeleteClick);

    if (prevTripEventComponent === null || prevTripEventEditComponent === null) {
      render(this._tripEventsListContainer, this._tripEventComponent, InsertPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripEventComponent, prevTripEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripEventEditComponent, prevTripEventEditComponent);
    }

    remove(prevTripEventComponent);
    remove(prevTripEventEditComponent);
  }

  destroy() {
    remove(this._tripEventComponent);
    remove(this._tripEventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTripEvent();
    }
  }

  _replaceTripEventToEdit() {
    replace(this._tripEventEditComponent, this._tripEventComponent);
    this._changeMode();
    this._mode = Mode.EDITING;

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceEditToTripEvent() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
    this._mode = Mode.DEFAULT;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._tripEventEditComponent.reset(this._events);
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

  _handleFormEventSubmit(update) {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.MAJOR,
        update
    );

    this._replaceEditToTripEvent();
  }

  _handleFormDeleteClick(event) {
    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MAJOR,
        event
    );
  }

  _handlerFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._events,
            {
              isFavorite: !this._events.isFavorite
            }
        )
    );
  }
}
