//обрабатывает лайки и клики по кнопке «Написать».

import { comments } from './comments.js';
import { renderComments } from './renderComments.js';
import { addComment } from './api.js';
import { sanitizeHtml } from './sanitizeHtml.js';
import { fetchAndRenderComments } from './main.js';

function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

// 1. Цитирование
export function initCommentListeners() {
  const commentElements = document.querySelectorAll('.comment');
  const textInput = document.querySelector('.add-form-text');

   // ЕСЛИ ПОЛЬЗОВАТЕЛЬ НЕ АВТОРИЗОВАН — поля ввода нет, цитировать некуда
  if (!textInput) {
    return;
  }

  for (const commentElement of commentElements) {
    commentElement.addEventListener('click', () => {
      const index = commentElement.dataset.index;
      const currentComment = comments[index];

      textInput.value = `> ${currentComment.text}\n${currentComment.author.name}, `;
      textInput.focus();
    });
  }
}

// 2. Лайки
export function initLikeButtonListeners() {
  const likeButtons = document.querySelectorAll('.like-button');

  for (const likeButton of likeButtons) {
    likeButton.addEventListener('click', (event) => {
      event.stopPropagation();

      const commentIndex = Number(likeButton.dataset.commentIndex);
      const comment = comments[commentIndex];

      if (comment.isLikeLoading) {
        return;
      }

      comment.isLikeLoading = true;
      renderComments();

      delay(2000).then(() => {
        if (comment.isLiked === false) {
          comment.isLiked = true;
          comment.likes = comment.likes + 1;
        } else {
          comment.isLiked = false;
          comment.likes = comment.likes - 1;
        }

        comment.isLikeLoading = false;
        renderComments();
      });
    });
  }
}

// 3. Кнопка "Написать"
export function initAddCommentListener() {
  const addButton = document.querySelector('.add-form-button');
  const textInput = document.querySelector('.add-form-text');
  const addFormElement = document.querySelector('.add-form');

  const loadingCommentElement = document.querySelector('.loading-comment-text');
  // ЕСЛИ КНОПКИ НЕТ (пользователь не вошёл) — просто выходим, никакой ошибки не будет!
  if (!addButton) {
    return;
  }

  addButton.addEventListener('click', () => {
    
    const text = sanitizeHtml(textInput.value.trim());

    if ( text === '') {
      return;
    }

    addFormElement.style.display = 'none';
    loadingCommentElement.style.display = 'block';

    addComment({ text })
      .then(() => {
        return fetchAndRenderComments();
      })
      .then(() => {
        addFormElement.style.display = 'flex';
        loadingCommentElement.style.display = 'none';

        
        textInput.value = '';
      })
      .catch((error) => {
        addFormElement.style.display = 'flex';
        loadingCommentElement.style.display = 'none';

        if (error.message === 'НЕВЕРНЫЙ_ВВОД') {
          alert('Имя и комментарий должны быть не короче 3 символов');
          return;
        }

        if (error.message === 'СЕРВЕР_СЛОМАЛСЯ') {
          alert('Сервер сломался, попробуй позже');
          return;
        }

        alert('Кажется, у вас сломался интернет, попробуйте позже');
        console.error(error);
      });
  });
}