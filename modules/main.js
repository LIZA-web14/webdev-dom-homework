//управляет всем приложением

// 1. Импортируем всё необходимое (добавили token и renderLoginComponent)
import { getComments, token } from './api.js';
import { setComments } from './comments.js';
import { renderComments } from './renderComments.js';
import { initAddCommentListener } from './listeners.js';
import { renderLoginComponent } from './login-component.js';

// Переменная для хранения имени вошедшего пользователя
export let userName = null;

export const setUserName = (newName) => {
  userName = newName;
};

// Главная функция отрисовки приложения
export function renderApp() {
  const appElement = document.getElementById('app');

  // Формируем нижнюю часть:
  // Если token есть — показываем форму с readonly-именем
  // Иначе (:) — показываем ссылку на вход
  const bottomHtml = token
    ? `
      <div class="loading-comment-text" style="display: none;">Комментарий добавляется...</div>
      <div class="add-form">
        <input
          type="text"
          class="add-form-name"
          value="${userName}"
          readonly
        />

        <textarea
          class="add-form-text"
          placeholder="Введите ваш комментарий"
          rows="4"
        ></textarea>

        <div class="add-form-row">
          <button class="add-form-button">Написать</button>
        </div>
      </div>
    `
    : `
      <p class="auth-notice" style="margin-top: 20px;">
        Чтобы добавить комментарий, 
        <span class="auth-link" style="text-decoration: underline; cursor: pointer; color: #5555ff;">авторизуйтесь</span>
      </p>
    `;

  // Собираем весь экран (список комментов + низ)
  appElement.innerHTML = `
    <ul class="comments"></ul>
    ${bottomHtml}
  `;

  // 1. Отрисовываем сами комментарии внутри списка <ul>
  renderComments();

  // 2. Оживляем интерактив внизу страницы:
  if (token) {
    // Если пользователь вошёл — включаем кнопку "Написать"
    initAddCommentListener();
  } else {
    // Если гость — оживляем клик по ссылке "авторизуйтесь"
    const authLink = document.querySelector('.auth-link');
    authLink.addEventListener('click', () => {
      renderLoginComponent({
        appElement,
        setUserName,
        renderApp,
      });
    });
  }
}

// Функция GET: забирает комментарии с сервера и запускает renderApp
export function fetchAndRenderComments() {
  return getComments()
    .then((responseData) => {
      setComments(responseData.comments);
      renderApp(); // вызываем главную функцию отрисовки!
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

// СТАРТ: Первый запуск при открытии сайта
fetchAndRenderComments();