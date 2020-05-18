import {SHORT_MONTH_NAMES} from "./const.js";

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`,
};


const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours());
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

const formatDateAndTime = (date) => {
  const day = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth() + 1);
  const year = (date.getFullYear() - 2000).toString();

  return `${day}/${month}/${year} ${formatTime(date)}`;
};

const getShortDate = (fullDate) => {
  return (SHORT_MONTH_NAMES[fullDate.getMonth()].toUpperCase() + ` ` + fullDate.getDate());
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;

    case RenderPosition.AFTEREND:
      container.after(element);
      break;

    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export {
  RenderPosition,
  castTimeFormat,
  formatTime,
  formatDateAndTime,
  getShortDate,
  createElement,
  render
};
