import moment from "moment";
import {insertPosition} from "./const.js";

export const render = (container, element, place) => {
  switch (place) {
    case insertPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case insertPosition.BEFOREEND:
      container.append(element);
      break;
    case insertPosition.AFTEREND:
      container.after(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElement = (arr) => arr[(Math.random() * arr.length) | 0];

export const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());

export const generateDate = (maxShiftEventMinutes, startDate = null) => {
  const millisecondsShift = 1000 * 60 * maxShiftEventMinutes;
  const randomTimeShift = getRandomInteger(0, millisecondsShift);

  const startTime = startDate !== null ? startDate.getTime() : new Date().getTime();

  return new Date(startTime + randomTimeShift);
};

export const humanizeTime = (startDate, endDate) => {
  const ONE_HOUR_IN_MINUTES = 60;
  const ONE_DAY_IN_HOURS = 24;
  const readable = [];

  const startTime = moment(startDate);
  const endTime = moment(endDate);

  const getDiffTime = (value) => endTime.diff(startTime, value);

  const addZeroToNumber = (number) => number < 10 && number > 0 ? Math.round(`0` + number) : Math.round(number);

  if (getDiffTime(`days`) >= 1) {
    readable.push(`${addZeroToNumber(getDiffTime(`days`))}D
                   ${addZeroToNumber(getDiffTime(`hours`) - (getDiffTime(`days`) * ONE_DAY_IN_HOURS))}H
                   ${addZeroToNumber(getDiffTime(`minutes`) - (getDiffTime(`hours`) * ONE_HOUR_IN_MINUTES))}M`);
  }

  if (getDiffTime(`hours`) > 0 && getDiffTime(`days`) === 0) {
    readable.push(`${addZeroToNumber(getDiffTime(`hours`))}H
                   ${addZeroToNumber(getDiffTime(`minutes`) - (getDiffTime(`hours`) * ONE_HOUR_IN_MINUTES))}M`);
  }

  if (getDiffTime(`minutes`) < ONE_HOUR_IN_MINUTES) {
    readable.push(`${addZeroToNumber(getDiffTime(`minutes`))}M`);
  }

  return readable;
};

export const separateEventsIntoDays = (sortedEvents) => {
  const days = [];

  const getUniqDates = new Set(sortedEvents.map((event) => moment(event.startDate).format(`YYYY-MM-DD`)));

  getUniqDates.forEach((it) => {
    days[it] = [];
  });

  sortedEvents.forEach((event) => {
    const oneDay = moment(event.startDate).format(`YYYY-MM-DD`);

    days[oneDay].push(event);
  });

  return days;
};
