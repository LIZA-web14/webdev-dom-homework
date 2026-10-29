// main.js
import { getComments } from './api.js';
import { setComments } from './comments.js';
import { renderComments } from './renderComments.js';
import { initAddCommentListener } from './listeners.js';

const loadingCommentsElement = document.querySelector('.loading-comments');

// Функция GET: забирает комментарии с сервера и рисует их
export function fetchAndRenderComments() {
  return getComments()
    .then((responseData) => {
      setComments(responseData.comments);
      renderComments();
    })
    .catch((error) => {
      if (error.message === 'СЕРВЕР_СЛОМАЛСЯ') {
        alert('Сервер сломался, попробуй позже');
        return;
      }
      alert('Кажется, у вас сломался интернет, попробуйте позже');
      console.error('Технические подробности:', error);
    });
}

// 1. Включаем кнопку добавления комментария
initAddCommentListener();

// 2. СТАРТ: Загружаем комментарии при входе на сайт
fetchAndRenderComments().then(() => {
  if (loadingCommentsElement) {
    loadingCommentsElement.style.display = 'none';
  }
});