import {InsertPosition, UpdateType, FilterType, MenuItem} from "../const.js";
import {render, remove} from "../utils/render.js";

import TripControlsView from "../view/trip-controls.js";
import TripEventAddButtonView from "../view/trip-event-add-button.js";
import StatsView from "../view/stats.js";

export default class TripControls {
  constructor(tripControlsContainer, statsContainer, tripEventAddButtonContainer, tripBordPresenter, eventsModel, filterModel) {
    this._tripControlsContainer = tripControlsContainer;
    this._statsContainer = statsContainer;
    this._tripEventAddButtonContainer = tripEventAddButtonContainer;
    this._tripBordPresenter = tripBordPresenter;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;

    this._tripControlsComponent = null;
    this._tripEventAddButtonComponent = null;
    this._statsComponent = null;

    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);
    this._handleEventNewFormClose = this._handleEventNewFormClose.bind(this);
  }

  init() {
    this._renderTripControls();
    this._renderTripEventAddButton();

    this._tripControlsComponent.setMenuClickHandler(this._handleSiteMenuClick);
    this._tripEventAddButtonComponent.setAddButtonClickHandler(this._handleSiteMenuClick);
  }

  _renderTripControls() {
    const tripControlsTitle = this._tripControlsContainer.querySelector(`h2`);

    this._tripControlsComponent = new TripControlsView(this._controlModel);
    render(tripControlsTitle, this._tripControlsComponent, InsertPosition.AFTEREND);
  }

  _renderTripEventAddButton() {
    this._tripEventAddButtonComponent = new TripEventAddButtonView();
    render(this._tripEventAddButtonContainer, this._tripEventAddButtonComponent, InsertPosition.BEFOREEND);
  }

  _handleEventNewFormClose() {
    this._tripEventAddButtonComponent.setAddButtonDisabled(false);
    this._tripControlsComponent.setMenuItem(MenuItem.EVENTS);
  }

  _handleSiteMenuClick(menuItem) {
    switch (menuItem) {
      case MenuItem.ADD_EVENT:
        remove(this._statsComponent);
        this._tripBordPresenter.destroy();

        this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
        this._tripBordPresenter.init();
        this._tripBordPresenter.createTask(this._handleEventNewFormClose);

        this._tripEventAddButtonComponent.setAddButtonDisabled(true);
        this._tripControlsComponent.setMenuItem(menuItem);
        break;

      case MenuItem.EVENTS:
        remove(this._statsComponent);
        this._tripBordPresenter.init();
        this._tripControlsComponent.setMenuItem(menuItem);
        break;

      case MenuItem.STATS:
        this._tripBordPresenter.destroy();

        this._statsComponent = new StatsView(this._eventsModel.getEvents());
        render(this._statsContainer.parentElement, this._statsComponent, InsertPosition.BEFOREEND);

        this._tripControlsComponent.setMenuItem(menuItem);
        break;
    }
  }
}