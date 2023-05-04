class KeyboardNinja {
  constructor(main_element_id) {
    this.char_elements = [];
    this.current_index = 0;

    this.main_element = document.getElementById(main_element_id);
    this.bind_events();
  }

  clear() {
    this.text = "";
    this.char_elements = [];
    this.current_index = 0;
    // Удаляет все элементы в главном
    this.main_element.innerHTML = "";
  }

  set_text(text) {
    this.clear();
    this.text = text;

    for (let i = 0; i < text.length; i++) {
      let char_element = document.createElement("div");
      char_element.classList.add("letter");
      char_element.innerHTML = replace_space(text[i]);
      this.char_elements = [...this.char_elements, char_element];

      this.main_element.appendChild(char_element);
    }
  }

  //TODO: Доделать
  show_statisticts() {
    return new Error("Not Yet Implemented");
  }

  bind_events() {
    document.addEventListener("keydown", (event) => {
      if (isNonSystemSymbol(event.keyCode)) {
        this.handle_keypress(event.key);
      }
    });
  }

  handle_keypress(key) {
    // TODO Переход на статистику
    if (this.current_index >= this.text.length) return;

    if (key == this.text[this.current_index]) {
      this.char_elements[this.current_index].classList.add("letter_right");
      this.current_index++;
    } else if (key == "Backspace") {
      this.current_index--;
      this.char_elements[this.current_index].classList.remove("letter_error");
      this.char_elements[this.current_index].classList.remove("letter_right");
    } else {
      this.char_elements[this.current_index].classList.add("letter_error");
      this.current_index++;
    }
  }
}

function replace_space(char) {
  return char == " " ? "&nbsp;" : char;
}

// TODO: Добавить в массив разрешенные символы
function isNonSystemSymbol(keyCode) {
  return (
    (keyCode >= 48 && keyCode <= 57) || // numbers
    (keyCode >= 65 && keyCode <= 90) || // uppercase letters
    (keyCode >= 97 && keyCode <= 122) || // lowercase letters
    keyCode === 32 || // space
    keyCode === 8 || // backspace
    keyCode === 191 || // ?
    keyCode === 190 || // .
    keyCode === 188 || // ,
    keyCode === 169 || // -
    keyCode === 167 || // +
    keyCode === 186 // ||
  );
}
