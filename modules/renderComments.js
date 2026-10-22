const commentsList = document.querySelector('.comments');
const textInput = document.querySelector('.add-form-text');

// 1. Функция задержки (имитация ожидания ответа сервера)
function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

function initCommentListeners(comments) {
  const commentElements = document.querySelectorAll('.comment');

  for (const commentElement of commentElements) {
    commentElement.addEventListener('click', () => {
      const index = commentElement.dataset.index;
      const currentComment = comments[index];

      textInput.value = `> ${currentComment.text}\n${currentComment.author.name}, `;
      textInput.focus();
    });
  }
}

function initLikeButtonListeners(comments) {
  const likeButtons = document.querySelectorAll('.like-button');

  for (const likeButton of likeButtons) {
    likeButton.addEventListener('click', (event) => {
      event.stopPropagation();

      const commentIndex = Number(likeButton.dataset.commentIndex);
      const comment = comments[commentIndex];

      // Защита: если лайк уже в процессе загрузки — не даем кликать повторно!
      if (comment.isLikeLoading) {
        return;
      }

      // 1. Включаем состояние загрузки лайка
      comment.isLikeLoading = true;
      renderComments(comments); // Сразу перерисовываем, чтобы включилась анимация!

      // 2. Имитируем запрос к серверу на 2 секунды (2000 мс)
      delay(2000).then(() => {
        // Сервер "ответил" через 2 секунды! Меняем лайк:
        if (comment.isLiked === false) {
          comment.isLiked = true;
          comment.likes = comment.likes + 1;
        } else {
          comment.isLiked = false;
          comment.likes = comment.likes - 1;
        }

        // Выключаем загрузку
        comment.isLikeLoading = false;
        renderComments(comments); // Перерисовываем с новым числом и цветом!
      });
    });
  }
}

export function renderComments(comments) {
  commentsList.innerHTML = comments
    .map((comment, index) => {
      let activeClass = '';

      if (comment.isLiked) {
        activeClass = '-active-like';
      }

      // Если лайк грузится — добавляем класс анимации
      let loadingClass = '';
      if (comment.isLikeLoading) {
        loadingClass = '-loading-like';
      }

      const formattedDate = new Date(comment.date).toLocaleString();

      return `
          <li class="comment" data-index="${index}">
            <div class="comment-header">
              <div>${comment.author.name}</div>
              <div>${formattedDate}</div>
            </div>

            <div class="comment-body">
              <div class="comment-text">
                ${comment.text}
              </div>
            </div>

            <div class="comment-footer">
              <div class="likes">
                <span class="likes-counter">
                  ${comment.likes}
                </span>

                <!-- Добавили ${loadingClass} в список классов кнопки -->
                <button
                  class="like-button ${activeClass} ${loadingClass}"
                  data-comment-index="${index}"
                ></button>
              </div>
            </div>
          </li>
        `;
    })
    .join('');

  initCommentListeners(comments);
  initLikeButtonListeners(comments);
}