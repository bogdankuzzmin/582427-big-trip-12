import {InsertPosition, UpdateType} from "../const.js";
import {render, remove} from "../utils/render.js";

import SiteMenuView from "../view/site-menu.js";
import SiteMenuPriceView from "../view/site-menu-price.js";
import SiteMenuRouteView from "../view/site-menu-route.js";

export default class SiteMenu {
  constructor(siteMenuContainer, eventsModel) {
    this._siteMenuContainer = siteMenuContainer;
    this._eventsModel = eventsModel;

    this._siteMenuComponent = null;
    this._siteMenuPriceComponent = null;
    this._siteMenuRouteComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
  }

  _handleModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._clearSiteMenu();
        this.init();
        break;
    }
  }

  init() {
    this._renderSiteMenu();
    this._renderSiteMenuRoute();
    this._renderSiteMneuPrice();
  }

  _clearSiteMenu() {
    remove(this._siteMenuComponent);
    remove(this._siteMenuPriceComponent);
    remove(this._siteMenuRouteComponent);
  }

  _renderSiteMenu() {
    const events = this._eventsModel.getEvents();

    this._siteMenuComponent = new SiteMenuView(events);
    render(this._siteMenuContainer, this._siteMenuComponent, InsertPosition.AFTERBEGIN);
  }

  _renderSiteMenuRoute() {
    const events = this._eventsModel.getEvents();

    this._siteMenuRouteComponent = new SiteMenuRouteView(events);
    render(this._siteMenuComponent, this._siteMenuRouteComponent, InsertPosition.AFTERBEGIN);
  }

  _renderSiteMneuPrice() {
    const events = this._eventsModel.getEvents();

    this._siteMenuPriceComponent = new SiteMenuPriceView(events);
    render(this._siteMenuRouteComponent, this._siteMenuPriceComponent, InsertPosition.AFTEREND);
  }
}
