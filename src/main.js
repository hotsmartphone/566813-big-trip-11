import {createTripInfoTemplate} from './components/trip-info-template.js';
import {createTripCostTemplate} from './components/trip-cost-template.js';
import {createViewMenuTemplate} from './components/view-menu-template .js';
import {createTripFiltersTemplate} from './components/trip-filters-template.js';
import {createTripSortTemplate} from './components/trip-sort-template .js';
import {createNewEventTemplate} from './components/new-event-template .js';
import {createTripDayTemplate} from './components/trip-day-template.js';
import {createEventItemTemplate} from './components/event-item-template.js';

const POINT_TRIP_COUNT = 3;

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const menuControls = tripControls.querySelector(`h2`);
const tripEvents = document.querySelector(`.trip-events`);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

render(tripMain, createTripInfoTemplate(), `afterbegin`);

const tripInfo = tripMain.querySelector(`.trip-info`);

render(tripInfo, createTripCostTemplate());
render(menuControls, createViewMenuTemplate(), `afterend`);
render(tripControls, createTripFiltersTemplate());
render(tripEvents, createTripSortTemplate());
render(tripEvents, createNewEventTemplate());
render(tripEvents, createTripDayTemplate());

const eventsList = tripEvents.querySelector(`.trip-events__list`);

for (let i = 0; i < POINT_TRIP_COUNT; i++) {
  render(eventsList, createEventItemTemplate(), `afterbegin`);
}
