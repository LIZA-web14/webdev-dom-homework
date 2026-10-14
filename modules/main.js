import { sanitizeHtml } from './sanitizeHtml.js';
import { renderComments } from './renderComments.js';

const nameInput = document.querySelector('.add-form-name');
const textInput = document.querySelector('.add-form-text');
const addButton = document.querySelector('.add-form-button');

let comments = [
  {
    name: 'Глеб Фокин',
    date: '12.02.22 12:18',
    text: 'Это будет первый комментарий на этой странице',
    likes: 3,
    isLiked: false,
  },
  {
    name: 'Варвара Н.',
    date: '13.02.22 19:22',
    text: 'Мне нравится как оформлена эта страница! ❤',
    likes: 75,
    isLiked: true,
  },
];

addButton.addEventListener('click', () => {
  const name = sanitizeHtml(nameInput.value.trim());
  const text = sanitizeHtml(textInput.value.trim());

  if (name === '' || text === '') {
    return;
  }

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  comments.push({
    name: name,
    date: `${day}.${month}.${year} ${hours}:${minutes}`,
    text: text,
    likes: 0,
    isLiked: false,
  });

  nameInput.value = '';
  textInput.value = '';

  renderComments(comments);
});

// Запуск приложения
renderComments(comments);
