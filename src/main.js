import {InsertPosition, MenuItem} from "./const.js";
import {render} from "./utils/render.js";
import {sortTypeEvent} from "./utils/sort.js";

import TripBoardPresenter from "./presenter/trip-board.js";
import SiteMenuPresenter from "./presenter/site-menu.js";
import FilterPresenter from "./presenter/filter.js";

import EventsModel from "./model/events.js";
import OffersModel from "./model/offers.js";
import DestinationModel from "./model/destination.js";
import FilterModel from "./model/filter.js";

import TripControlsView from "./view/trip-controls.js";
import TripeventAddButtonView from "./view/trip-event-add-button.js";

import {generateEvent} from "./mock/event.js";
import {generateDestination} from "./mock/destination.js";
import {generateOffers} from "./mock/offers.js";

const MAX_WAYPOINTS = 22;

const offers = generateOffers();
const destination = generateDestination();
const events = new Array(MAX_WAYPOINTS).fill().map(() => generateEvent(offers, destination));
const sortedEvents = events.sort(sortTypeEvent);
// console.log(sortedEvents);

const offersModel = new OffersModel();
offersModel.setOffers(offers);

const destinationModel = new DestinationModel();
destinationModel.setDestination(destination);

const eventsModel = new EventsModel();
eventsModel.setEvents(sortedEvents);

const filterModel = new FilterModel();

const tripMain = document.querySelector(`.trip-main`);


const tripControls = document.querySelector(`.trip-main__trip-controls`);
const tripControlsTitle = tripControls.querySelector(`h2`);
const tripEventContainer = document.querySelector(`.trip-events`);

const tripControlsComponent = new TripControlsView();
render(tripControlsTitle, tripControlsComponent, InsertPosition.AFTEREND);

const tripBoardPresenter = new TripBoardPresenter(tripEventContainer, eventsModel, offersModel, destinationModel, filterModel);
const filterPresenter = new FilterPresenter(tripControls, filterModel, eventsModel);
const siteMenuPresenter = new SiteMenuPresenter(tripMain, eventsModel);

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_EVENT:
      tripBoardPresenter.createTask();
      // Скрыть статистику
      // Показать доску
      // Показать форму добавления новой задачи
      // Убрать выделение с ADD NEW TASK после сохранения
      break;
    case MenuItem.EVENTS:
      // Показать доску
      // Скрыть статистику
      break;
    case MenuItem.STATS:

      // Скрыть доску
      // Показать статистику
      break;
  }
};

tripControlsComponent.setMenuClickHandler(handleSiteMenuClick);

siteMenuPresenter.init();
filterPresenter.init();
tripBoardPresenter.init();

const tripEventAddButton = new TripeventAddButtonView();
render(tripMain, tripEventAddButton, InsertPosition.BEFOREEND);

tripEventAddButton.setAddButtonClickHandler(handleSiteMenuClick);
