class KeyboardNinja {
  constructor(main_element_id, carret_element_id, stats_holder_element_id) {
    this.char_elements = [];
    this.current_char_index = 0;
    this.is_paused = true;

    this.main_element = document.getElementById(main_element_id);
    this.carret_element = document.getElementById(carret_element_id);
    this.stats_element = document.getElementById(stats_holder_element_id);

    this.char_count_time_rel = {};

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
    this.char_count_time_rel = {};
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
    const char_count = this.text.length;
    const word_count = this.text.split(" ").length;
    const wpm = Math.round(this.text.split(" ").length / this.sec_passed);

    this.stats_element.innerHTML = "";
    this.main_element.innerHTML = "";

    const statistics_el = document.createElement("div");
    statistics_el.innerHTML = `
    CPM (Characters Per Minute): ${char_count}</br>
    WPM (Words Per Minute): ${word_count}</br>`;
    statistics_el.classList.add("stats");
    const canvas = document.createElement("canvas");
    statistics_el.appendChild(canvas);
    this.main_element.appendChild(statistics_el);

    const data = Object.keys(this.char_count_time_rel).map((e) => {
      return {
        sec: e,
        error: this.char_count_time_rel[e].error,
        correct: this.char_count_time_rel[e].correct,
      };
    });

    new Chart(canvas, {
      type: "line",
      data: {
        labels: Object.keys(this.char_count_time_rel),
        datasets: [
          {
            label: "# of Errors",
            data: data.map((d) => ({ x: d.sec, y: d.error })),
            backgroundColor: "rgba(255, 0, 0, 0.5)", // Red color with 50% opacity
            borderColor: "rgba(255, 0, 0, 1)", // Red color with full opacity
          },
          {
            label: "# of Correct",
            data: data.map((d) => ({ x: d.sec, y: d.correct })),
            backgroundColor: "rgba(0, 255, 0, 0.5)", // Green color with 50% opacity
            borderColor: "rgba(0, 255, 0, 1)", // Green color with full opacity
          },
        ],
      },
      options: {
        title: {
          display: true,
          text: "seconds",
          fontSize: 8,
        },
        elements: {
          line: {
            tension: 0.3,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
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

    this.sec_passed = Math.floor((new Date() - this.timer_start) / 1000);
    this.timer_element.innerText = `${this.sec_passed} sec`;
    setTimeout(() => this.update_timer(), 1000);
  }

  bind_events() {
    document.addEventListener("keydown", (event) => {
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
    if (this.current_char_index >= this.text.length) return;
    if (this.is_paused) return;

    // Начало написания текста
    if (this.current_char_index == 0) {
      this.timer_start = new Date();
      this.update_timer();
      this.show_carret();
    }

    if (!this.char_count_time_rel[this.sec_passed ?? 0]) {
      this.char_count_time_rel[this.sec_passed ?? 0] = {
        error: 0,
        correct: 0,
      };
    }

    if (key == this.text[this.current_char_index]) {
      this.char_elements[this.current_char_index].classList.add("letter_right");
      this.current_char_index++;

      this.char_count_time_rel[this.sec_passed ?? 0].correct++;
    } else if (key == "Backspace") {
      this.current_char_index--;
      this.char_elements[this.current_char_index].classList.remove("letter_error");
      this.char_elements[this.current_char_index].classList.remove("letter_right");
    } else {
      this.char_elements[this.current_char_index].classList.add("letter_error");
      this.current_char_index++;

      this.char_count_time_rel[this.sec_passed ?? 0].error++;
    }

    // Конец написания текста
    if (this.current_char_index == this.text.length) {
      this.timer_start = undefined;
      this.hide_carret();

      this.show_statisticts();
    } else {
      const letter_coordinates = this.char_elements[this.current_char_index].getBoundingClientRect();
      this.carret_element.style.left = letter_coordinates.left + "px";
      this.carret_element.style.top = letter_coordinates.top + 5 + "px";

      this.update_counters();
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

if (typeof window === "undefined") {
  module.exports = {
    isNonSystemSymbol,
    replace_space,
  };
}
