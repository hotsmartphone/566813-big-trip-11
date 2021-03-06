import TripSortComponent, {SortType} from '../components/trip-sort-template.js';
import NewEventComponent from '../components/new-event-template.js';
import TripDayComponent from '../components/trip-day-template.js';
import TripDaysBoardComponent from '../components/trip-days-board-template.js';
import EventItemComponent from '../components/event-item-template.js';
import NoEventsComponent from '../components/no-events-template.js';

import {RenderPosition, render, replace} from '../utils/render.js';


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

const renderEvent = (dayEventsElement, event) => {
  const replaceEventToEdit = () => {
    replace(editEventComponent, eventItemComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventItemComponent, editEventComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const eventItemComponent = new EventItemComponent(event);
  eventItemComponent.setEditButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const editEventComponent = new NewEventComponent(event);
  editEventComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  editEventComponent.setResetHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(dayEventsElement, eventItemComponent, RenderPosition.BEFOREEND);
};

const renderDay = (container, day, index) => { // функция принимает на вход обект с датой и событиями этой даты, отрисовывает день и в нем отрисовывает события
  render(container, new TripDayComponent(day, index), RenderPosition.BEFOREEND);
  const currentDayEventsList = container.lastChild.querySelector(`.trip-events__list`);
  day.events.forEach((event) => {
    renderEvent(currentDayEventsList, event);
  });
};

const renderEvents = (container, events, sortType) => { // функция принимает на вход обект с датой и событиями этой даты, отрисовывает день и в нем отрисовывает события
  if (sortType === SortType.DEFAULT) {
    events.forEach((day, index) => {
      renderDay(container, day, index);
    });
  } else {
    render(container, new TripDayComponent(), RenderPosition.BEFOREEND);
    const currentDayEventsList = container.lastChild.querySelector(`.trip-events__list`);

    events.forEach((event) => renderEvent(currentDayEventsList, event));
  }
};

const getSortedEvents = (events, sortType) => {
  let sortedEvents = [];
  const copiedEvents = events.slice();
  const getDurationEvent = (event) => {
    return (event.dateTo.getTime() - event.dateFrom.getTime());
  };

  switch (sortType) {
    case SortType.DEFAULT:
      sortedEvents = groupAndSortEventsByDays(events);
      break;

    case SortType.TIME:
      sortedEvents = copiedEvents.sort((a, b) => getDurationEvent(b) - getDurationEvent(a));
      break;

    case SortType.PRICE:
      sortedEvents = copiedEvents.sort((a, b) => b.price - a.price);
      break;
  }

  return sortedEvents;
};


class TripController {
  constructor(container) {
    this._container = container;
    this._containerHeadElement = container.querySelector(`h2`);

    this._noEventsComponent = new NoEventsComponent();
    this._tripSortComponent = new TripSortComponent();
    this._tripDaysBoardComponent = new TripDaysBoardComponent();
  }

  render(events) {
    if (events.length === 0 || !events) {
      render(this._container, this._noEventsComponent, RenderPosition.BEFOREEND);
    } else {
      render(this._containerHeadElement, this._tripSortComponent, RenderPosition.AFTEREND);
      render(this._container, this._tripDaysBoardComponent, RenderPosition.BEFOREEND);

      let sortedEvents = getSortedEvents(events, SortType.DEFAULT);

      renderEvents(this._tripDaysBoardComponent.getElement(), sortedEvents, SortType.DEFAULT);

      this._tripSortComponent.setSortTypeChangeHandler((sortType) => {
        sortedEvents = getSortedEvents(events, sortType);

        this._tripDaysBoardComponent.getElement().innerHTML = ``;

        renderEvents(this._tripDaysBoardComponent.getElement(), sortedEvents, sortType);
      });
    }
  }
}

export default TripController;
