export class Service {
  static URL = 'https://rickandmortyapi.com/api/';

  _url(path) {
    return Service.URL + path;
  }

  _get(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);

      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) reject('server error');
        resolve(JSON.parse(xhr.response));
      });

      xhr.addEventListener('error', () => reject('network error'));

      xhr.send();
    });
  }

  async getAllCharacters() {
    try {
      const numberOfPages = (await this._get(this._url('character'))).info.pages;
      let characters = [];

      for(let i = 1; i <= numberOfPages; i++) {
        const page = (await this._get(this._url('character?page=' + i))).results;

        page.forEach(character => {
          characters.push({name: character.name, image: character.image});
        });
      }

      return characters;
    } catch(error) {
      throw error;
    }
  }
}