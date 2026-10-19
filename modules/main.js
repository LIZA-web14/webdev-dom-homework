import { sanitizeHtml } from './sanitizeHtml.js';
import { renderComments } from './renderComments.js';

const nameInput = document.querySelector('.add-form-name');
const textInput = document.querySelector('.add-form-text');
const addButton = document.querySelector('.add-form-button');

// Адрес личного хранилища на сервере
const host = 'https://wedev-api.sky.pro/api/v1/Liza/comments';

// Пустой массив, куда мы положим данные из интернета
let comments = [
//   
];
// Функция GET: забирает комментарии с сервера и рисует их
function fetchAndRenderComments () {
    fetch(host, {
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
// При открытии сайта сразу скачиваем и показываем комментарии
fetchAndRenderComments();

addButton.addEventListener('click', () => {
  const name = sanitizeHtml(nameInput.value.trim());
  const text = sanitizeHtml(textInput.value.trim());

  if (name === '' || text === '') {
    return;
  }

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
    // Сервер подтвердил: «Я всё сохранил!»
      // Теперь очищаем поля формы, чтобы юзер мог писать следующий комментарий:
      nameInput.value = '';
      textInput.value = '';

      // А как показать новый комментарий на экране?
      // Мы просто вызываем нашу функцию как было выше на33строчке!
      fetchAndRenderComments();
  })

  
});

