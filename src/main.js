import TripInfoComponent from './components/trip-info-template.js';
import TripCostComponent from './components/trip-cost-template.js';
import ViewMenuComponent from './components/view-menu-template.js';
import TripFiltersComponent from './components/trip-filters-template.js';
import TripSortComponent from './components/trip-sort-template.js';
import NewEventComponent from './components/new-event-template.js';
import TripDayComponent from './components/trip-day-template.js';
import TripDaysBoardComponent from './components/trip-days-board-template.js';
import EventItemComponent from './components/event-item-template.js';

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
render(tripEvents, new TripSortComponent().getElement(), RenderPosition.BEFOREEND);
render(tripMain, new TripInfoComponent(events, groupedEvents).getElement(), RenderPosition.AFTERBEGIN);

const tripInfo = tripMain.querySelector(`.trip-info`);

render(tripInfo, new TripCostComponent(events).getElement(), RenderPosition.BEFOREEND);
render(tripEvents, new TripDaysBoardComponent().getElement(), RenderPosition.BEFOREEND);

const daysBoard = tripEvents.querySelector(`.trip-days`);

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

const renderDay = (day, index) => { // функция принимает на вход обект с датой и событиями этой даты, отрисовывает день и в нем отрисовывает события
  render(daysBoard, new TripDayComponent(day, index).getElement(), RenderPosition.BEFOREEND);
  const currentDayEventsList = daysBoard.lastChild.querySelector(`.trip-events__list`);
  day.events.forEach((event) => {
    renderTask(currentDayEventsList, event);
  });
};

groupedEvents.forEach((day, index) => {
  renderDay(day, index);
});
