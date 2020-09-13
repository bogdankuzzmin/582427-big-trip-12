import TripEventEditView from "../view/new-event.js";

import {render, remove} from "../utils/render.js";
import {InsertPosition, UserAction, UpdateType} from "../const.js";
import randomId from "random-id";

export default class NewEvent {
  constructor(tripEventsListContainer, changeData) {
    this._tripEventsListContainer = tripEventsListContainer;
    this._changeData = changeData;

    this._destroyCallback = null;
    this._tripEventEditComponent = null;

    this._handleFormEventSubmit = this._handleFormEventSubmit.bind(this);
    this._handleFormDeleteClick = this._handleFormDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(destinations, events, offers, callback) {
    this._destroyCallback = callback;

    if (this._tripEventEditComponent !== null) {
      return;
    }

    this._tripEventEditComponent = new TripEventEditView(destinations, events, offers);
    this._tripEventEditComponent.setFormEventSubmitHandler(this._handleFormEventSubmit);
    this._tripEventEditComponent.setFormDeleteClickHandler(this._handleFormDeleteClick);

    render(this._tripEventsListContainer, this._tripEventEditComponent, InsertPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._tripEventEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._tripEventEditComponent);
    this._tripEventEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormEventSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR,
        Object.assign({id: randomId(3)}, event)
    );

    this.destroy();
  }

  _handleFormDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
