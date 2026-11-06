// делает запросы

// Адрес личного хранилища на сервере
const host = 'https://wedev-api.sky.pro/api/v2/Liza/comments';
//  Адрес для входа (авторизации)
const authHost = 'https://wedev-api.sky.pro/api/user/login';
// Переменая-карман для хранения токена
export let token = null;

// Функция, которая кладёт полученный токен в наш карман
export function setToken(newToken) {
  token = newToken;
}


// 1. Получение комментариев (GET)
 export function getComments() {

    //  Создаем пустую коробочку для заголовков
    const headers = {}; 

    // Если токен есть — добавляем в коробочку наш пропуск
    if (token){
        headers.Authorization = `Bearer ${token}`;
    }

    return fetch(host, { 
        method: 'GET',
        headers: headers, // Передали коробочку с заголовками
    })
    .then((response) => {
      

      if(response.status === 500){
        throw new Error('СЕРВЕР_СЛОМАЛСЯ')
      }
        return response.json(); //  Переводим ответ сервера в понятный JS-объект
    })
    
    
}
// 2. Создание комментария (POST)
export function addComment({ text }){
   return fetch(host, {
    method:  'POST',
    headers: {
      Authorization: `Bearer ${token}`, // Обязательно показываем токен
    },
    body: JSON.stringify({
      
      text: text, // только текст
    }),
  })
  .then((response) => {
    if(response.status === 400){
      throw new Error('НЕВЕРНЫЙ_ВВОД');
    }
    if(response.status === 500){
      throw new Error('СЕРВЕР_СЛОМАЛСЯ');
    }
      return response.json(); // распаковываем ответ сервера: { result: "ok" }
    })
}
// 4. Функция принимает данные от пользователя:
export function login({ login, password }) {
  // 5. Возвращаем наружу промис:
  return fetch(
    // 1. По адресу из документации:
    authHost,
    {
      // 2. С методом из документации:
      method: 'POST',
      // 3. С телом из документации:
      body: JSON.stringify({
        login: login,
        password: password,
      }),
    }
  );
}
