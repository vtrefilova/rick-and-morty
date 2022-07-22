import { Service } from "./service.js";

export class PageComponent {
  search;
  characters;

  constructor() {
    this.errorContainer = document.querySelector(".error");
    this.suggestions = document.querySelector(".suggestions");
    this.searchInput = document.querySelector(".search");

    this.service = new Service();
    //может долго грузить список если полностью отчистить историю браузера (максимум 10 сек)
    this._loadData();
  }

  onInput(event) {
    //получаем на вход подстроку в нижнем регистре для поиска
    this.search = this.searchInput.value.toLowerCase().trim();

    //ищем подстроку и фильтруем список
    this._filterData();
  }

  _filterData() {
    //если в строке что-то написано
    if (this.search != "") {
      //пробегаем все карточки
      this.characters.forEach((card) => {
        //запоминаем имя персонажа и получаем первый индекс нашей подстроки в строке
        let name = card.querySelector('div').innerText;
        let index = name.toLowerCase().indexOf(this.search);
  
        //Проверяем наличие подстроки без учета регистра
        if (index == -1) {
          //если в карточке не нашлось подстроки, то скрываем ее
          card.classList.add("hidden");

          //избавляемся от выделений удалением тега mark
          card.querySelector('div').innerHTML = card.querySelector('div').innerText;
        } else {
          //убираем скрытие если оно было
          card.classList.remove("hidden");

          //!!! заметил что все слова должны быть с большой буквы
          //!!! исправил если это играет роль
          //сбросим трансформацию текста для корректной работы выделения
          card.style.textTransform = 'none';

          //выделяем нужный кусок
          card.querySelector('div').innerHTML = name.slice(0, index) + '<mark>' +
            name.slice(index, index + this.search.length) + '</mark>' +
            name.slice(index + this.search.length);
        }
      });
    } else {
      this.characters.forEach((card) => {
        //показываем все карточки если все стерли
        card.classList.remove("hidden");

        card.querySelector('div').innerHTML = card.querySelector('div').innerText;
      });
    }
  }

  _loadData() {
    //получаем персонажей или ошибку
    this.service.getAllCharacters()
      .then(characters => this._onUpdateSuccess(characters))
      .catch(error => this._errorMessage(error));
  }

  _onUpdateSuccess(characters) {
    //удалаяем стартовую 'загрузку...'
    this.suggestions.querySelector("li").remove();

    //добовляем html элементы на табло
    this._prepareHtml(characters);

    //добавляю DOM персонажей в массив
    this.characters = this.suggestions.querySelectorAll("li");

    //добавляем событие на поиск
    this.searchInput.addEventListener("input", this.onInput.bind(this));
  }

  _errorMessage(message) {
    //пишим ошибку на табло
    this.errorContainer.append("Error: " + message);
  }

  _prepareHtml(characters) {
    //пробегаем по всем персонажам
    characters.forEach((character) => {
      //создаем для каждого персонажа картачку с именем и фото
      const card = document.createElement('li');
      //div понадобиться для работы с выделенем 
      const nameBlock = document.createElement('div')
      const image = document.createElement('img');

      //заполняем карточку
      image.classList.add('character-image');
      card.appendChild(nameBlock);
      card.appendChild(image);
      image.setAttribute("src", character.image);
      nameBlock.append(character.name);

      //добовляем все карточки в список
      this.suggestions.appendChild(card);
    });
  }
}
