import moment from "moment";
import {render, remove} from "../utils/render.js";
import {separateEventsIntoDays} from "../utils/event.js";
import {InsertPosition, SortType, UpdateType, UserAction, FilterType} from "../const.js";

import TripEventPresenter from "./trip-event.js";
import NewEventPresenter from "./new-event.js";

import TripEventListView from "../view/trip-event-list.js";
import TripEventDaysView from "../view/trip-event-days.js";
import TripNoEventsView from "../view/trip-no-events.js";
import TripSortView from "../view/trip-sort.js";

import {sortTypeTime, sortTypePrice, sortTypeEvent} from "../utils/sort.js";
import {filter} from "../utils/filter.js";

export default class Trip {
  constructor(tripEventContainer, eventsModel, offersModel, destinationModel, filterModel) {
    this._tripEventContainer = tripEventContainer;
    this._eventsModel = eventsModel;
    this._offersModel = offersModel;
    this._destinationModel = destinationModel;
    this._filterModel = filterModel;

    this._currentSortType = SortType.EVENT;
    this._tripEventPresenter = {};
    this._tripDaysStorage = {};

    this._tripSortComponent = null;

    this._tripEventDaysComponent = new TripEventDaysView();
    this._tripNoEventsComponent = new TripNoEventsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._newEventPresenter = new NewEventPresenter(this._tripEventContainer, this._handleViewAction);
  }

  init() {
    this._renderEvents();
  }

  createTask() {
    this._currentSortType = SortType.EVENT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newEventPresenter.init(this._destinationModel.getDestination(), null, this._offersModel.getOffers());
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.EVENT:
        return filteredEvents.sort(sortTypeEvent);
      case SortType.TIME:
        return filteredEvents.sort(sortTypeTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortTypePrice);
    }

    return filteredEvents;
  }

  _handleModeChange() {
    this._newEventPresenter.destroy();

    Object
      .values(this._tripEventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    // console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        this._tripEventPresenter[data.id].init(this._destinationModel.getDestination(), data, this._offersModel.getOffers());
        break;
      case UpdateType.MINOR:
        this._clearTripEventsList();
        this._renderEvents();
        break;
      case UpdateType.MAJOR:
        this._clearTripEventsList({resetSortType: true});
        this._renderEvents();
        break;
    }
  }

  _renderEvents() {
    if (this._getEvents().length === 0) {
      this._renderNoTripEvents();
      return;
    }

    this._renderTripSort();
    this._renderTripEventDaysContainer();

    if (this._currentSortType === `event`) {
      this._renderTripEventDays();
      return;
    }

    this._renderEventsWithoutDays();
  }

  _renderNoTripEvents() {
    render(this._tripEventContainer, this._tripNoEventsComponent, InsertPosition.BEFOREEND);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTripEventsList();
    this._renderEvents();
  }

  _renderTripSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripSortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripEventContainer, this._tripSortComponent, InsertPosition.BEFOREEND);
  }

  _clearTripEventsList({resetSortType = false} = {}) {
    this._newEventPresenter.destroy();

    Object
      .values(this._tripEventPresenter)
      .forEach((presenter) => presenter.destroy());

    Object
      .values(this._tripDaysStorage)
      .forEach((day) => remove(day));

    this._tripEventPresenter = {};
    this._tripDaysStorage = {};

    remove(this._tripNoEventsComponent);
    remove(this._tripSortComponent);
    remove(this._tripEventDaysComponent);

    if (resetSortType) {
      this._currentSortType = SortType.EVENT;
    }
  }

  _renderTripEventDaysContainer() {
    render(this._tripEventContainer, this._tripEventDaysComponent, InsertPosition.BEFOREEND);
  }

  _renderTripEventPresenter(tripEventsListContainer, events) {
    const tripEventPresenter = new TripEventPresenter(tripEventsListContainer, this._handleViewAction, this._handleModeChange);
    tripEventPresenter.init(this._destinationModel.getDestination(), events, this._offersModel.getOffers());
    this._tripEventPresenter[events.id] = tripEventPresenter;
  }

  _renderTripEventDays() {
    const events = this._getEvents().slice();
    const groupSeparatedEvents = separateEventsIntoDays(events);

    Object.keys(groupSeparatedEvents).forEach((oneDay, dayId) => {
      const eventDay = (formatDate) => moment(oneDay).format(formatDate);
      const tripEventsListComponent = new TripEventListView(dayId + 1, eventDay, groupSeparatedEvents[oneDay]);
      render(this._tripEventDaysComponent, tripEventsListComponent, InsertPosition.BEFOREEND);
      this._tripDaysStorage[oneDay] = tripEventsListComponent;

      groupSeparatedEvents[oneDay].forEach((event) => {
        this._renderTripEventPresenter(tripEventsListComponent.getEventListContainer(), event);
      });
    });
  }

  _renderEventsWithoutDays() {
    const tripEventsListComponent = new TripEventListView(null, null);
    render(this._tripEventDaysComponent, tripEventsListComponent, InsertPosition.BEFOREEND);
    this._tripDaysStorage[`oneDay`] = tripEventsListComponent;

    const events = this._getEvents().slice();

    events.forEach((event) => {
      this._renderTripEventPresenter(tripEventsListComponent.getEventListContainer(), event);
    });
  }

}
