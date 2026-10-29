// Хранилище списка комментариев
// Пустой массив, куда мы положим данные из интернета
export let comments = [];

// Функция для безопасного обновления комментариев из любого другого файла
export function setComments(newComments) {
  comments = newComments;
}