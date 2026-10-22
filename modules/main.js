import { sanitizeHtml } from './sanitizeHtml.js';
import { renderComments } from './renderComments.js';
// 1. Находим элементы на странице

const nameInput = document.querySelector('.add-form-name');
const textInput = document.querySelector('.add-form-text');
const addButton = document.querySelector('.add-form-button');
// Новые элементы для лоадеров:
const loadingCommentsElement = document.querySelector('.loading-comments');
const addFormElement = document.querySelector('.add-form');
const loadingCommentElement = document.querySelector('.loading-comment-text');

// Адрес личного хранилища на сервере
const host = 'https://wedev-api.sky.pro/api/v1/Liza/comments';

// Пустой массив, куда мы положим данные из интернета
let comments = [
//   
];
// Функция GET: забирает комментарии с сервера и рисует их
function fetchAndRenderComments () {
    return fetch(host, {
        method: 'GET',
    })
    .then((response) => {
        return response.json(); //  Переводим ответ сервера в понятный JS-объект
    })
    .then ((responseData) => {
        // Сервер прислал объект: { comments: [...] }
      // берём этот массив и кладём в наш let comments:
      comments = responseData.comments;
    //   Запускаем отрисовку! 
      renderComments(comments); 
    })
    
}

// 3. СТАРТ: Загружаем комментарии при входе на сайт
fetchAndRenderComments().then(() => {
  // Когда первая загрузка завершилась — скрываем надпись "Комментарии загружаются..."
  loadingCommentsElement.style.display = 'none';
});

addButton.addEventListener('click', () => {
  const name = sanitizeHtml(nameInput.value.trim());
  const text = sanitizeHtml(textInput.value.trim());

  if (name === '' || text === '') {
    return;
  }
   // ВОТ ЗДЕСЬ МЫ ИСПОЛЬЗУЕМ ЭТИ ПЕРЕМЕННЫЕ:
  // Прячем форму и показываем надпись "Комментарий добавляется..."
  addFormElement.style.display = 'none';
  loadingCommentElement.style.display = 'block';


  fetch(host, {
    method:  'POST',
    body: JSON.stringify({
      name: name, // имя из инпута
      text: text, // текст из инпута
    }),
  })
  .then((response) => {
      return response.json(); // распаковываем ответ сервера: { result: "ok" }
    })
  .then(() => {
      // POST завершился -> возвращаем GET-запрос:
      return fetchAndRenderComments();
    })
    .then(() => {
      // Данные скачались! Возвращаем форму обратно на экран:
      addFormElement.style.display = 'flex';
      loadingCommentElement.style.display = 'none';

      // Очищаем форму:
      nameInput.value = '';
      textInput.value = '';
    
    })

  
});         

