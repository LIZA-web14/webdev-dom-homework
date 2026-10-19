const commentsList = document.querySelector('.comments');
const textInput = document.querySelector('.add-form-text');

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

      if (comment.isLiked === false) {
        comment.isLiked = true;
        comment.likes = comment.likes + 1;
      } else {
        comment.isLiked = false;
        comment.likes = comment.likes - 1;
      }

      renderComments(comments);
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

      return `
          <li class="comment" data-index="${index}">
            <div class="comment-header">
              <div>${comment.author.name}</div>
              <div>${comment.date}</div>
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
                  class="like-button ${activeClass}"
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
