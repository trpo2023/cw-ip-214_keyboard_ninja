class KeyboardNinja {
  constructor(main_element_id, carret_element_id, stats_holder_element_id) {
    this.char_elements = [];
    this.current_char_index = 0;
    this.is_paused = true;

    this.main_element = document.getElementById(main_element_id);
    this.carret_element = document.getElementById(carret_element_id);
    this.stats_element = document.getElementById(stats_holder_element_id);

    this.bind_events();

    this.show_helper_text();
  }

  show_helper_text() {
    if (this.helper_text_el == undefined) {
      this.helper_text_el = document.createElement("a");
      this.helper_text_el.innerText = "Для продождения выберите словарь.";
      this.helper_text_el.style.textAlign = "center";
      this.helper_text_el.id = "helper_text";
      this.main_element.parentElement.appendChild(this.helper_text_el);
    }

    this.helper_text_el.style.display = "block";
  }

  hide_helper_text() {
    this.helper_text_el.style.display = "none";
  }

  show_restart_btn() {
    if (this.restart_btn_el == undefined) {
      this.restart_btn_el = document.createElement("button");
      this.restart_btn_el.id = "restart-button";
      this.restart_btn_el.innerText = "Restart";
      this.restart_btn_el.onclick = () => {
        this.clear();
      };
      this.main_element.parentElement.appendChild(this.restart_btn_el);
    }

    this.restart_btn_el.style.display = "block";
  }

  hide_restart_btn() {
    if (this.restart_btn_el == undefined) return;

    this.restart_btn_el.style.display = "none";
  }

  clear() {
    this.text = "";
    this.char_elements = [];
    this.current_char_index = 0;
    this.main_element.innerHTML = "";
    this.stats_element.innerHTML = "";
    this.word_counter_element = undefined;
    this.timer_element = undefined;
    this.timer_start = undefined;
    this.is_paused = true;

    this.hide_carret();
    this.hide_restart_btn();
    this.show_helper_text();
  }

  set_text(text) {
    this.clear();
    this.hide_helper_text();
    this.text = text;
    this.is_paused = false;

    this.init_counters();

    for (let i = 0; i < text.length; i++) {
      let char_element = document.createElement("div");
      char_element.classList.add("letter");
      char_element.innerHTML = replace_space(text[i]);
      this.char_elements = [...this.char_elements, char_element];

      this.main_element.appendChild(char_element);
    }

    this.show_restart_btn();
  }

  //TODO: Доделать
  show_statisticts() {
    return new Error("Not Yet Implemented");
  }

  init_counters() {
    this.stats_element.innerHTML = "";

    this.word_counter_element = document.createElement("div");
    this.word_counter_element.classList.add("word_counter");
    this.word_counter_element.innerText = `0/${this.text.length}`;
    this.stats_element.appendChild(this.word_counter_element);

    this.timer_element = document.createElement("div");
    this.timer_element.classList.add("timer");
    this.timer_element.innerText = `0 sec`;

    this.stats_element.appendChild(this.timer_element);
    this.timer_start = Date.now;
  }

  update_counters() {
    if (this.word_counter_element == undefined) return;

    this.word_counter_element.innerText = `${this.current_char_index}/${this.text.length - 1}`;
  }

  update_timer() {
    if (this.timer_start == undefined) return;

    const sec_passed = Math.floor((new Date() - this.timer_start) / 1000);
    this.timer_element.innerText = `${sec_passed} sec`;
    setTimeout(() => this.update_timer(), 1000);
  }

  bind_events() {
    document.addEventListener("keydown", (event) => {
      console.log(event.key);
      if (isNonSystemSymbol(event.key)) {
        this.handle_keypress(event.key);
      }
    });
  }

  show_carret() {
    this.carret_element.style.display = "block";
  }

  hide_carret() {
    this.carret_element.style.display = "none";
  }

  handle_keypress(key) {
    // TODO Переход на статистику
    if (this.current_char_index >= this.text.length) return;
    if (this.is_paused) return;

    // Начало написания текста
    if (this.current_char_index == 0) {
      this.timer_start = new Date();
      this.update_timer();
      this.show_carret();
    }

    if (key == this.text[this.current_char_index]) {
      this.char_elements[this.current_char_index].classList.add("letter_right");
      this.current_char_index++;
    } else if (key == "Backspace") {
      this.current_char_index--;
      this.char_elements[this.current_char_index].classList.remove("letter_error");
      this.char_elements[this.current_char_index].classList.remove("letter_right");
    } else {
      this.char_elements[this.current_char_index].classList.add("letter_error");
      this.current_char_index++;
    }

    const letter_coordinates = this.char_elements[this.current_char_index].getBoundingClientRect();
    this.carret_element.style.left = letter_coordinates.left + "px";
    this.carret_element.style.top = letter_coordinates.top + 5 + "px";

    this.update_counters();
    // Конец написания текста
    if (this.current_char_index == this.text.length - 1) {
      this.timer_start = undefined;
      this.hide_carret();
      return;
    }
  }
}

function replace_space(char) {
  return char == " " ? "&nbsp;" : char;
}

function isNonSystemSymbol(key) {
  const russian_letters = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
  const numbers = "01234567890";
  const specials = " !@#$%^&*~()_[]{}|./'\"№;:?+-\\<>";
  const eng_letters = "abcdefghijklmnopqrstuvwxyz";

  const keys = ["Backspace"];
  const all_symb = russian_letters + numbers + specials + eng_letters;
  const all_symb_upper = all_symb.toUpperCase();
  return all_symb.includes(key) || all_symb_upper.includes(key) || keys.includes(key);
}

module.exports = {
  isNonSystemSymbol,
  replace_space,
};
