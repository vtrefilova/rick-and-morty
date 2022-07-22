import { Service } from "./service.js";

export class PageComponent {
  search;
  characters;

  constructor() {
    this.errorContainer = document.querySelector(".error");
    this.suggestions = document.querySelector(".suggestions");
    this.searchInput = document.querySelector(".search");

    this.service = new Service();
    this._loadData();
  }

  onInput(event) {
    this.search = this.searchInput.value.toLowerCase().trim();

    this._filterData();
  }

  _filterData() {
    if (this.search != "") {
      this.characters.forEach((card) => {
        let name = card.querySelector('div').innerText;
        let index = name.toLowerCase().indexOf(this.search);
  
        if (index == -1) {
          card.classList.add("hidden");

          card.querySelector('div').innerHTML = card.querySelector('div').innerText;
        } else {
          card.classList.remove("hidden");

          card.style.textTransform = 'none';

          card.querySelector('div').innerHTML = name.slice(0, index) + '<mark>' +
            name.slice(index, index + this.search.length) + '</mark>' +
            name.slice(index + this.search.length);
        }
      });
    } else {
      this.characters.forEach((card) => {
        card.classList.remove("hidden");

        card.querySelector('div').innerHTML = card.querySelector('div').innerText;
      });
    }
  }

  _loadData() {
    this.service.getAllCharacters()
      .then(characters => this._onUpdateSuccess(characters))
      .catch(error => this._errorMessage(error));
  }

  _onUpdateSuccess(characters) {
    this.suggestions.querySelector("li").remove();

    this._prepareHtml(characters);

    this.characters = this.suggestions.querySelectorAll("li");

    this.searchInput.addEventListener("input", this.onInput.bind(this));
  }

  _errorMessage(message) {
    this.errorContainer.append("Error: " + message);
  }

  _prepareHtml(characters) {
    characters.forEach((character) => {
      const card = document.createElement('li');
      const nameBlock = document.createElement('div')
      const image = document.createElement('img');

      image.classList.add('character-image');
      card.appendChild(nameBlock);
      card.appendChild(image);
      image.setAttribute("src", character.image);
      nameBlock.append(character.name);

      this.suggestions.appendChild(card);
    });
  }
}
