import TripInfoComponent from './components/trip-info-template.js';
import TripInfoMainComponent from './components/trip-info-main-template.js';
import TripInfoCostComponent from './components/trip-info-cost-template.js';
import ViewMenuComponent from './components/view-menu-template.js';
import TripFiltersComponent from './components/trip-filters-template.js';
import TripSortComponent from './components/trip-sort-template.js';
import NewEventComponent from './components/new-event-template.js';
import TripDayComponent from './components/trip-day-template.js';
import TripDaysBoardComponent from './components/trip-days-board-template.js';
import EventItemComponent from './components/event-item-template.js';
import NoEventsComponent from './components/no-events-template.js';

import {generateEvents} from './mock/point.js';
import {RenderPosition, render} from './utils.js';

const POINT_TRIP_COUNT = 20;

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const menuControls = tripControls.querySelector(`h2`);
const tripEvents = document.querySelector(`.trip-events`);

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

const tripInfoComponent = new TripInfoComponent().getElement();

render(tripMain, tripInfoComponent, RenderPosition.AFTERBEGIN);
render(tripInfoComponent, new TripInfoCostComponent(events).getElement(), RenderPosition.BEFOREEND);

const renderTask = (dayEventsElement, event) => {
  const replaceEventToEdit = () => {
    dayEventsElement.replaceChild(editEventComponent.getElement(), eventItemComponent.getElement());
  };

  const replaceEditToEvent = () => {
    dayEventsElement.replaceChild(eventItemComponent.getElement(), editEventComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const eventItemComponent = new EventItemComponent(event);
  const editButton = eventItemComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, () => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const editEventComponent = new NewEventComponent(event);
  editEventComponent.getElement().addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  editEventComponent.getElement().addEventListener(`reset`, (evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(dayEventsElement, eventItemComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderDay = (container, day, index) => { // функция принимает на вход обект с датой и событиями этой даты, отрисовывает день и в нем отрисовывает события
  render(container, new TripDayComponent(day, index).getElement(), RenderPosition.BEFOREEND);
  const currentDayEventsList = container.lastChild.querySelector(`.trip-events__list`);
  day.events.forEach((event) => {
    renderTask(currentDayEventsList, event);
  });
};

if (events.length === 0 || !events) {
  render(tripEvents, new NoEventsComponent().getElement(), RenderPosition.BEFOREEND);
} else {
  render(tripEvents, new TripSortComponent().getElement(), RenderPosition.BEFOREEND);
  render(tripMain, new TripInfoMainComponent(events, groupedEvents).getElement(), RenderPosition.AFTERBEGIN);

  const tripDaysBoardComponent = new TripDaysBoardComponent().getElement();
  render(tripEvents, tripDaysBoardComponent, RenderPosition.BEFOREEND);

  groupedEvents.forEach((day, index) => {
    renderDay(tripDaysBoardComponent, day, index);
  });
}
