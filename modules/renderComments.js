
import { comments } from './comments.js';
import { initCommentListeners, initLikeButtonListeners } from './listeners.js';

const commentsList = document.querySelector('.comments');

// Функция ТОЛЬКО рисует HTML на странице
export function renderComments() {
  commentsList.innerHTML = comments
    .map((comment, index) => {
      let activeClass = '';
      if (comment.isLiked) {
        activeClass = '-active-like';
      }

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

  // После вставки верстки оживляем цитаты и лайки:
  initCommentListeners();
  initLikeButtonListeners();
}