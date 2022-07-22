export class Service {
  static URL = 'https://rickandmortyapi.com/api/';

  _url(path) {
    return Service.URL + path;
  }

  _get(url) {
    return new Promise((resolve, reject) => {
      //создаем запрос и указываем что мы от него хотим
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);

      //при загрузки страницы
      xhr.addEventListener('load', () => {
        //если проблемы с сервером (оговариваем с беком, по дефолту 400)
        if (xhr.status >= 400) reject('server error');
        //если все супер
        resolve(JSON.parse(xhr.response));
      });

      //если проблемы с сетью
      xhr.addEventListener('error', () => reject('network error'));

      //отправляем наш запрос
      xhr.send();
    });
  }

  async getAllCharacters() {
    try {
      //узнаем количество разделов с персонажами
      const numberOfPages = (await this._get(this._url('character'))).info.pages;
      let characters = [];

      for(let i = 1; i <= numberOfPages; i++) {
        //получаем персонажей со страницы
        const page = (await this._get(this._url('character?page=' + i))).results;

        //пробегаем персонажей на странице
        page.forEach(character => {
          //закидываем в массив объект с именем и картинкой
          characters.push({name: character.name, image: character.image});
        });
      }

      return characters;
    } catch(error) {
      //если были ошибки
      throw error;
    }
  }
}