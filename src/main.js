import TripInfoComponent from './components/trip-info-template.js';
import TripCostComponent from './components/trip-cost-template.js';
import ViewMenuComponent from './components/view-menu-template.js';
import TripFiltersComponent from './components/trip-filters-template.js';
import TripSortComponent from './components/trip-sort-template.js';
import NewEventComponent from './components/new-event-template.js';
import TripDayComponent from './components/trip-day-template.js';
import {generateEvents} from './mock/point.js';

import {RenderPosition, render} from './utils.js';

const POINT_TRIP_COUNT = 20;

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const menuControls = tripControls.querySelector(`h2`);
const tripEvents = document.querySelector(`.trip-events`);



// const render = (container, template, place = `beforeend`) => {
//   container.insertAdjacentHTML(place, template);
// };

const events = generateEvents(POINT_TRIP_COUNT);

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

  groupedEvents.sort((a, b) => { // сортируем в блоки событий по дате
    return a.date.getTime() - b.date.getTime();
  });

  groupedEvents.forEach((item) => { // в каждом блоке (дате) сортируем массив событий по дате начала
    item.events.sort((a, b) => {
      return a.dateFrom.getTime() - b.dateFrom.getTime();
    });
  });

  return groupedEvents; // на выходе получаем массив объектов с ключами "День" и "События" (этого дня), сортированные по дате
};

const groupedEvents = groupAndSortEventsByDays(events);

render(menuControls, new ViewMenuComponent().getElement(), RenderPosition.AFTEREND);
render(tripControls, new TripFiltersComponent().getElement(), RenderPosition.BEFOREEND);
//////////////////////////////render(tripControls, createTripFiltersTemplate());
render(tripEvents, new TripSortComponent().getElement(), RenderPosition.BEFOREEND);

//render(tripEvents, new TripSortComponent().getElement(), RenderPosition.BEFOREEND);
render(tripEvents, new NewEventComponent(events[0]).getElement(), RenderPosition.BEFOREEND);
render(tripMain, new TripInfoComponent(events, groupedEvents).getElement(), RenderPosition.AFTERBEGIN);

const tripInfo = tripMain.querySelector(`.trip-info`);

render(tripInfo, new TripCostComponent(events).getElement(), RenderPosition.BEFOREEND);

groupedEvents.forEach((day, index) => {
  render(tripEvents, new TripDayComponent(day, index).getElement(), RenderPosition.BEFOREEND);
});
