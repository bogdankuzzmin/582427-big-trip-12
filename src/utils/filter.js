import moment from "moment";
import {FilterType} from "../const.js";

export const filter = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => moment().isBefore(event.startDate)),
  [FilterType.PAST]: (events) => events.filter((event) => moment().isAfter(event.startDate)),
};
