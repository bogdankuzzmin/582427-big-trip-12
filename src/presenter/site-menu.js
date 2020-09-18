import {InsertPosition, UpdateType} from "../const.js";
import {render, remove} from "../utils/render.js";
import {sortTypeEvent} from "../utils/sort.js";
import {filter} from "../utils/filter.js";

import SiteMenuView from "../view/site-menu.js";
import SiteMenuPriceView from "../view/site-menu-price.js";
import SiteMenuRouteView from "../view/site-menu-route.js";

export default class SiteMenu {
  constructor(siteMenuContainer, eventsModel, filterModel) {
    this._siteMenuContainer = siteMenuContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;

    this._siteMenuComponent = null;
    this._siteMenuPriceComponent = null;
    this._siteMenuRouteComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  _handleModelEvent(updateType) {
    if (updateType === UpdateType.MAJOR) {
      this._clearSiteMenu();
      this.init();
    }
  }

  init() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events).sort(sortTypeEvent);

    this._renderSiteMenu();
    this._renderSiteMenuRoute(filteredEvents);
    this._renderSiteMneuPrice(filteredEvents);
  }

  _clearSiteMenu() {
    remove(this._siteMenuComponent);
    remove(this._siteMenuPriceComponent);
    remove(this._siteMenuRouteComponent);
  }

  _renderSiteMenu() {
    this._siteMenuComponent = new SiteMenuView();
    render(this._siteMenuContainer, this._siteMenuComponent, InsertPosition.AFTERBEGIN);
  }

  _renderSiteMenuRoute(events) {
    this._siteMenuRouteComponent = new SiteMenuRouteView(events);
    render(this._siteMenuComponent, this._siteMenuRouteComponent, InsertPosition.AFTERBEGIN);
  }

  _renderSiteMneuPrice(events) {
    this._siteMenuPriceComponent = new SiteMenuPriceView(events);
    render(this._siteMenuRouteComponent, this._siteMenuPriceComponent, InsertPosition.AFTEREND);
  }
}
