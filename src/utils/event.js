import moment from "moment";
import {getRandomInteger} from "../utils/common.js";
import {EVENT_ACTION} from "../const.js";

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

  const addZeroToNumber = (number) => number < 10 && number > 0 ? `0` + number : Math.round(number);

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

export const getPrepositon = (actionType) => {
  let preposition = `to`;

  if (Object.values(EVENT_ACTION.activities).includes(actionType)) {
    preposition = `in`;
  }

  return preposition;
};
