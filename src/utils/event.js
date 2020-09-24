import moment from "moment";
import {capitalizeFirstLetter} from "../utils/common.js";
import {EVENT_ACTION} from "../const.js";

const ONE_HOUR_IN_MINUTES = 60;
const ONE_DAY_IN_HOURS = 24;

export const humanizeTime = (startDate, endDate) => {
  const readableDates = [];

  const startTime = moment(startDate);
  const endTime = moment(endDate);

  const getDiffTime = (value) => endTime.diff(startTime, value);

  const addZeroToNumber = (number) => number < 10 && number > 0 ? `0` + number : Math.round(number);

  if (getDiffTime(`days`) >= 1) {
    readableDates.push(`${addZeroToNumber(getDiffTime(`days`))}D
                   ${addZeroToNumber(getDiffTime(`hours`) - (getDiffTime(`days`) * ONE_DAY_IN_HOURS))}H
                   ${addZeroToNumber(getDiffTime(`minutes`) - (getDiffTime(`hours`) * ONE_HOUR_IN_MINUTES))}M`);
  }

  if (getDiffTime(`hours`) > 0 && getDiffTime(`days`) === 0) {
    readableDates.push(`${addZeroToNumber(getDiffTime(`hours`))}H
                   ${addZeroToNumber(getDiffTime(`minutes`) - (getDiffTime(`hours`) * ONE_HOUR_IN_MINUTES))}M`);
  }

  if (getDiffTime(`minutes`) < ONE_HOUR_IN_MINUTES) {
    readableDates.push(`${addZeroToNumber(getDiffTime(`minutes`))}M`);
  }

  return readableDates;
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

export const getPrepositon = (actionType) => {
  const type = capitalizeFirstLetter(actionType);

  return Object.values(EVENT_ACTION.activities).includes(type) ? `in` : `to`;
};

export const getOffers = (offers, type) => {
  return offers.find((it) => it.type === type).offers;
};
