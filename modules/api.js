// Адрес личного хранилища на сервере
const host = 'https://wedev-api.sky.pro/api/v1/Liza/comments';

// 1. Получение комментариев (GET)
 export function getComments() {
    return fetch(host, {
        method: 'GET',
    })
    .then((response) => {
      

      if(response.status === 500){
        throw new Error('СЕРВЕР_СЛОМАЛСЯ')
      }
        return response.json(); //  Переводим ответ сервера в понятный JS-объект
    })
    
    
}
// 2. Создание комментария (POST)
export function addComment({ name, text }){
    fetch(host, {
    method:  'POST',
    body: JSON.stringify({
      name: name, // имя из инпута
      text: text, // текст из инпута
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
