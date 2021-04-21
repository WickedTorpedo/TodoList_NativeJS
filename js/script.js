'use strict';

let taskList = [];
let todo = document.getElementById('todo');
let setting = document.getElementById('setting');
let palette = document.getElementById('palette');
let clearTaskList = document.getElementById('clear-taskList');
let sort = document.getElementById('sort');
let sortMsg = document.getElementById('sortMsg');
let colorDefault = document.getElementById('color-default');

let data = {}; // не привязна к опеределенному переменнему, по сути хранилище результатов выполнение функций

function setToLocal(taskList) {localStorage.setItem('todo', JSON.stringify(taskList));} // сохранить Task(-и) в localStorage [START]
function getInLocal() {return JSON.parse(localStorage.getItem('todo'));} // получить Task(-и) из localStorage [START]



// получение задач при перезагрузке/загрузке страницы [START]
if (getInLocal()) {
  taskList = getInLocal();
  taskUpdateList(taskList);
}; // [END]


// очистка списка задач [START]
clearTaskList.addEventListener('click', function() {
  taskList = [];
  taskUpdateList(taskList);
  setToLocal(taskList);
}); // [END]

// === вызов (скорее show) меню для выборка темы, использует хранилищу data === [START]  //
palette.addEventListener('click', function() {

  if (!data.selectedTopic) {

    function topicListItem(bgBadge, infoText, colorTopic) {
      let badge = createElement('div', {'className': 'size-2 mr-1 ' + bgBadge} );
      let text = createElement('span', {}, [infoText]);
      let color = createElement('span', {'className': 'z-important'}); color.setAttribute('data-topic', colorTopic);


      let item = createElement('div', {'className': 'topic-list__item'}, [badge, text, color]);

      return item;
    }

    let itemDefaultTopic = topicListItem('bg-light box-neon-light mr-2', 'По умолчанию', 'default');
    let itemLightTopic = topicListItem('bg-info  box-neon-blue mr-2', 'Светлая', 'light');
    let itemDarkTopic = topicListItem('bg-dark box-neon-red mr-2', 'Тёмная', 'dark');

    let topicList = createElement('div', {'className': 'topic-list'}, [
      itemDefaultTopic,
      itemLightTopic,
      itemDarkTopic
    ]);

    data.selectedTopic = createSelectedTopic('Тема', topicList);
    document.body.appendChild(data.selectedTopic);
  }

  data.selectedTopic.classList.toggle('show');

});
//  === [END] === //



// === ГЛАВНАЯ ФУНКЦИЯ который вызывает функции: создание, добавление, изменение и сохранение задачи [START] === //
(function int_main() {

  let todoMsg = document.getElementById('todo-msg');
  let todoAdd = document.getElementById('todo-add');


  todoMsg.onkeypress = function(event) {
    if (event.key === 'Enter') {
      addTodo();
      return false;
    }
  }

  todoAdd.addEventListener('click', addTodo, false);

  function addTodo() {
    if (todoMsg.value.length < 1) return;

    let taskObj = {
      msg: todoMsg.value,
      edit: false,
      index: taskList.length,
      date: new Date().toString(),
      color: 'silver'
    }

    taskList.push(taskObj);

    taskUpdateList(taskList);
    setToLocal(taskList);
    todoMsg.value = '';
  }

  // получение цвета фона при перезагрузке/загрузке страницы [START]
  if (localStorage.getItem('topic'))
    document.body.id = localStorage.getItem('topic');

  // установка вида сортировки
  if (localStorage.getItem('sort')) {
    sortMsg.textContent = localStorage.getItem('sort');
  } else sortMsg.textContent = 'Сортировка';


}());
//  === [END] === //



// === появление подсказки при наведение курсора === [START] //
(function hoverTooltip() {
  let dataHints = document.querySelectorAll('[data-hint]');

  dataHints.forEach( item => {
    let hint = createElement('span', {'className': 'hover-hint'}, [item.getAttribute('data-hint')]);

    item.addEventListener('mouseover', function() {
      item.appendChild(hint);
    })
    item.addEventListener('mouseleave', function() {
      item.removeChild(hint);
    })
  });

})();
//  === [END] === //


// === вызов настроек === [START]
/*
setting.onclick = function() {
  let modalSetting = createModal('xiy');
  modalSetting.classList.toggle('show');
  document.body.appendChild(modalSetting);
}*/
// === вызов настроек === [END]



// === создать список задач === [START]
function taskUpdateList(arr) {
  todo.innerHTML = '';


  let taskItems = [];
  for (let i = 0, length = arr.length; i < length; i++) {
    let msg = arr[i].msg;
    let edit = arr[i].edit;
    let color = arr[i].color;

    arr[i].index = i;

    let taskTime = (function () {
        let date = new Date(arr[i].date);
        let monthName = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

        let [hours, minutes] = [date.getHours(), date.getMinutes()];
        if (hours.toString().length === 1) hours = '0' + hours;
        if (minutes.toString().length === 1) minutes = '0' + minutes;

        return date.getDate() + '-' + monthName[date.getMonth()] + ' ' + date.getFullYear() + ' ' + hours + ':' + minutes;
    }());


    let item = taskAddView(msg, edit, i, taskTime, color);
    taskItems.push(item);
  }

  for (let task of taskItems)
    todo.appendChild(task);

  setToLocal(taskList);



}
//  === [END] === //


// создание todo-item и добавление событий на кнопки изменение/удаление/состояние [START]
function taskAddView(msg, edit, index, time, color) {

  let checkbox = createElement( 'input', {'type': 'checkbox', 'className': 'option-input'});
      checkbox.setAttribute('data-index', index);     // установить собственные атрибут для определние индекса

  let taskMsg = createElement( 'label', {'className': 'todo-label'}, [msg]);
  let taskMsgData = createElement( 'span', {'className': 'fSize-11 ml-1'}, [time]);

  let taskLabel = createElement('div', {'className': 'flex-column align-self-center'}, [taskMsg, taskMsgData]);

  let rowLeft = createElement( 'div', {'className': 'row align-center w-100 mr-1'}, [checkbox, taskLabel]);

  let btnUpdate  = createElement( 'input', {'type': 'button', 'className': 'btn-default mouseShow', 'value': 'Изменить'});
  let btnDelete  = createElement( 'input', {'type': 'button', 'className': 'btn-default mouseShow', 'value': 'Удалить'});
  let rowRight = createElement( 'div', {'className': 'row align-center'}, [btnUpdate, btnDelete]);

  let li = createElement( 'li', {'className': "todo__item " + color}, [rowLeft, rowRight]);

  // edit - состояние задачи, true - выполнено, иначе false
  if (edit)  {
    checkbox.checked = "checked";
    taskMsg.style.textDecoration = "line-through";
    taskMsg.style.opacity = "0.25";
    btnUpdate.classList.add('btn-off');
  } else checkbox.removeAttribute("checked");

  // checkbox
  checkbox.addEventListener('change', function(event) {
    let listItems = Array.from(todo.children);
    for (let i = 0, length = listItems.length; i < length; i++) {
      if (li == listItems[i]) {
        taskList[i].edit = !taskList[i].edit;
        taskUpdateList(taskList);
        setToLocal(taskList);
      }
    }
  });

  btnUpdate.addEventListener('click', function() {
    if (!edit) {
      let listItems = Array.from(todo.children);
      for (let i = 0, length = listItems.length; i < length; i++) {
        if (li == listItems[i]) {
          let replaceTask = taskUpdateView(taskList[i].msg);
          listItems.splice(i, 1, replaceTask);
        }
      }

      todo.innerHTML = '';
      listItems.forEach(li => todo.appendChild(li));
    }
  });

  btnDelete.addEventListener('click', function() {
    let listItems = Array.from(todo.children);
    for (let i = 0, length = listItems.length; i < length; i++) {
      if (li == listItems[i]) {
        taskList.splice(i, 1);
        taskUpdateList(taskList);
        setToLocal(taskList);
      }
    }
  });

  return li;
}
//  === [END] === //


// === Задача в состояние изменение (редактирование) === [START]
function taskUpdateView(msg) {

  let inputMsg  = createElement( 'input', {'type': 'text', 'className': 'input-text', 'value': msg});
  let rowLeft = createElement( 'div', {'className': 'row w-100 mr-1'}, [inputMsg]);

  let btnSave  = createElement( 'input', {'type': 'button', 'className': 'btn-default mouseShow', 'value': 'Сохранить'});
  let rowRight = createElement( 'div', {'className': 'row'}, [btnSave]);

  let li = createElement( 'li', {'className': "todo__item"}, [rowLeft, rowRight]);

  // функция кнопка сохранить изменённую задачу
  function saveTask() {
    let newMsg = inputMsg.value;
    let listItems = Array.from(todo.children);

    for (let i = 0, length = listItems.length; i < length; i++) {
      if (li == listItems[i]) {
        taskList[i].msg = newMsg;
        taskUpdateList(taskList);
        setToLocal(taskList);
      }
    }
  }

  // сохранить изменение при нажатие на enter или на кнопку сохранить
  btnSave.addEventListener('click', saveTask, false);
  window.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      saveTask();
      return false;
    }
  }, false)

  return li;
}
//  === [END] === //


// === Cоздание элемента === [START]
function createElement(tag, props, children = []) {
  let element = document.createElement(tag);

  for (let [key, value] of Object.entries(props))
  element[key] = value;

  children.forEach(function(item) {
    if (typeof item === 'string') {
        let textNode = document.createTextNode(item);
        element.appendChild(textNode);
    }
    else element.appendChild(item);
  });

  return element;
}
//  === [END] === //

// === Создание модального окна === [START] // пустое модальное окно
function createModal(content) {
  let modalWrapper = createElement('div', {'className': 'container-app'}, [content]);
  let modal = createElement('div', {'className': 'modal'}, [modalWrapper]);

  modal.onclick = function(event) {
    let target = event.target;
    if (target.classList.contains('modal'))
      this.classList.toggle('show');
  }

  return modal;
}
//  === [END] === //


// === Создание меню для выборка темы на модальном окно [START] === //
function createSelectedTopic(titleMsg, topicList) {

  let title = createElement('h2', {'className': 'big'}, [titleMsg]);
  let hr = createElement('hr', {'className': 'my-2 border-2 border-light box-neon-blue'});

  let btnClose = createElement('span', {'className': 'fas fa-window-close modal-close'});
  let topicWrapper = createElement('div', {'className': 'topic-wrapper'}, [title, hr, topicList]);
  let topic = createElement('div', {'className': 'topic'}, [btnClose, topicWrapper]);

  // созданная вертская для выборка тем запхиваются в модальное окно
  let modalTopic = createModal(topic);

  topic.onclick = function(event) {
    let target = event.target;

    if (target.hasAttribute('data-topic')) {
      let topicColor = target.getAttribute('data-topic');
      localStorage.setItem('topic', topicColor);
      document.body.id = topicColor;
    } else if (target.classList.contains('topic') || target.classList.contains('modal-close')) {
      modalTopic.classList.remove('show');
    }

    if (target.hasAttribute('data-sort')) {
      let topicSort = target.dataset.sort;

      switch(topicSort) {

        case 'sortAz': sortAz(taskList);
                        localStorage.setItem('sort', 'Сортировать задачи по алфавиту');
                        break;

        case 'sortCheck': sortCheck(taskList);
                          localStorage.setItem('sort', 'Сортировать задачи по состояние');
                          break;

        case 'sortColor': sortColor(taskList);
                          localStorage.setItem('sort', 'Сортировать задачи по цвету');
                          break;

        case 'sortTime': sortTime(taskList);
                         localStorage.setItem('sort', 'Сортировать задачи по дате создания');
                         break;
      }
      sortMsg.textContent = localStorage.getItem('sort');
      taskUpdateList(taskList);

    } else if (target.classList.contains('topic') || target.classList.contains('modal-close')) {
      modalTopic.classList.remove('show');
    }


  }

  return modalTopic;
}
// === [END] === //


// === вызов (скорее show) меню для выборка сортировки [START] === //
sort.addEventListener('click', function() {

  if (!data.selectedSort) {

    function topicListItem(bgBadge, infoText, sortType) {
      let badge = createElement('span', {'className': 'mr-2 ' + bgBadge} );
      let text = createElement('span', {}, [infoText]);
      let sort = createElement('span', {'className': 'z-important'}); sort.setAttribute('data-sort', sortType);

      let item = createElement('div', {'className': 'topic-list__item'}, [badge, text, sort]);
      return item;
    }


    let sortAz = topicListItem('fas fa-sort-alpha-down text-primary', 'по алфавиту', 'sortAz');
    let sortTimeCreate = topicListItem('fas fa-clock text-danger', 'по дате создания', 'sortTime');
    let sortColor = topicListItem('fas fa-palette text-warning', 'по цвету', 'sortColor');
    let sortCheck = topicListItem('fas fa-check-circle text-success', 'по состояние', 'sortCheck');

    let topicList = createElement('div', {'className': 'topic-list'}, [
      sortAz,
      sortTimeCreate,
      sortColor,
      sortCheck
    ]);


    data.selectedSort = createSelectedTopic('Сортировать', topicList);
    document.body.appendChild(data.selectedSort);
  }

  data.selectedSort.classList.toggle('show');
});
// === [END] === //


// === функция соритровка задач по алфавиту A-z [START] === //
function sortAz(taskList) {

  taskList.sort(function(a, b) {
    if (a.msg > b.msg)
    return 1;
    else if (a.msg === b.msg)
    return 0;
    else return -1;
  });
}
// === END === //

// === функция соритровка  по состояние задачи [START] === //
function sortCheck(taskList) {
  taskList.sort(function(a, b) {
    if (a.edit && !b.edit)
    return 1;

    else if (!a.edit && b.edit)
    return -1;

    else return 0;
  });
}
// === [END] === //


// === функция соритровка задач по времю создания [START] === //
function sortColor(taskList) {
  console.log('по цвету');
}
// === [END] === //

// === функция соритровка задач по времю создания [START] === //
function sortTime(taskList) {
  taskList.sort(function(a, b) {
    let date1 = new Date(a);
    let date2 = new Date(b);

    if (date1 > date2)
    return 1;

    else if (date1 === date2)
    return 0;

    else return -1;

  })
}
// === [END] === //

let vse = document.getElementsByClassName('like');

colorDefault.onclick = function(event) {

  if (!event.target.classList.contains('active')) {
    for (let item of vse)
    item.classList.remove('active');
    event.target.classList.add('active');
  } else return -1;


}
