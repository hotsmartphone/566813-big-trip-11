import {createTripInfoTemplate} from './components/trip-info-template.js';
import {createTripCostTemplate} from './components/trip-cost-template.js';
import {createViewMenuTemplate} from './components/view-menu-template .js';
import {createTripFiltersTemplate} from './components/trip-filters-template.js';
import {createTripSortTemplate} from './components/trip-sort-template .js';
import {createNewEventTemplate} from './components/new-event-template .js';
import {createTripDayTemplate} from './components/trip-day-template.js';
import {generateEvents} from './mock/point.js';

const POINT_TRIP_COUNT = 20;

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const menuControls = tripControls.querySelector(`h2`);
const tripEvents = document.querySelector(`.trip-events`);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const events = generateEvents(POINT_TRIP_COUNT);
console.log(events);

render(tripMain, createTripInfoTemplate(), `afterbegin`);

const tripInfo = tripMain.querySelector(`.trip-info`);

render(tripInfo, createTripCostTemplate());
render(menuControls, createViewMenuTemplate(), `afterend`);
render(tripControls, createTripFiltersTemplate());
render(tripEvents, createTripSortTemplate());
render(tripEvents, createNewEventTemplate(events[0]));

// const eventsList = tripEvents.querySelector(`.trip-events__list`);
//
// events.slice(1, events.length - 1)
// .forEach((event) => render(eventsList, createEventItemTemplate(event), `afterbegin`));

const groupEvents = (event, container) => { // функция добавляет карточку в определенную группу - день
  const eventDate = new Date(event.dateFrom.getFullYear(), event.dateFrom.getMonth(), event.dateFrom.getDate());

  const addEvent = () => {
    container.push(
        {
          date: eventDate,
          events: new Array(event),
        }
    );
  };

  const foundElement = container.find((item) => {
    return item.date.getTime() === eventDate.getTime();
  });

  if (foundElement !== undefined) {
    container[container.indexOf(foundElement)].events.push(event);
  } else {
    addEvent(container);
  }
};


const groupAndSortEventsByDays = (eventsArr) => { // функция  принимает мааасив событий, сортирует и группирует по датам
  const groupedEvents = [];

  eventsArr.forEach((event) => groupEvents(event, groupedEvents));

  groupedEvents.sort((a, b) => { // сортируем блоки событий по дате
    return a.date.getTime() - b.date.getTime();
  });

  groupedEvents.forEach((item) => { // в каждом блоке (дате) сортируем массив событий по дате начала
    item.events.sort((a, b) => {
      return a.dateFrom.getTime() - b.dateFrom.getTime();
    });
  });

  return groupedEvents;
};

const groupedEvents = groupAndSortEventsByDays(events);

console.log(`Сгруппированный и отсортированный массив]`);
console.log(groupedEvents);


groupedEvents.forEach((day, index) => {
  render(tripEvents, createTripDayTemplate(day, index));
});
