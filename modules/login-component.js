//рисует форму входа

import { login, setToken } from './api.js';

export function renderLoginComponent({ appElement, setUserName, renderApp }) {
  appElement.innerHTML = `
    <div class="form">
      <h3 class="form-title">Форма входа</h3>
      <div class="form-row">
        <input type="text" id="login-input" class="add-form-name" placeholder="Введите логин" />
        <br /><br />
        <input type="password" id="password-input" class="add-form-name" placeholder="Введите пароль" />
      </div>
      <br />
      <button class="add-form-button" id="login-button">Войти</button>
    </div>
  `;

  const buttonElement = document.getElementById('login-button');
  const loginInputElement = document.getElementById('login-input');
  const passwordInputElement = document.getElementById('password-input');

  buttonElement.addEventListener('click', () => {
    if (loginInputElement.value.trim() === '' || passwordInputElement.value.trim() === '') {
      alert('Пожалуйста, введите логин и пароль');
      return;
    }

    login({
      login: loginInputElement.value.trim(),
      password: passwordInputElement.value.trim(),
    })
      .then((response) => {
        if (response.status === 400) {
          throw new Error('НЕВЕРНЫЙ_ЛОГИН_ИЛИ_ПАРОЛЬ');
        }
        if (response.status === 500) {
          throw new Error('СЕРВЕР_СЛОМАЛСЯ');
        }
        return response.json();
      })
      .then((responseData) => {
        setToken(responseData.user.token);
        setUserName(responseData.user.name);
        renderApp();
      })
      .catch((error) => {
        if (error.message === 'НЕВЕРНЫЙ_ЛОГИН_ИЛИ_ПАРОЛЬ') {
          alert('Введен неправильный логин или пароль');
          return;
        }
        if (error.message === 'СЕРВЕР_СЛОМАЛСЯ') {
          alert('Сервер сломался, попробуйте позже');
          return;
        }
        alert('Кажется, сломался интернет, попробуйте позже');
        console.error(error);
      });
  });
}