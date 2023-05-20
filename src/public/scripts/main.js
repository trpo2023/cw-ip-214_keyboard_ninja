const select = document.getElementById("vocab_select");
const main_element_id = "main_text";
const carret_element_id = "carret";
const stats_holder_element_id = "stats";
const max_word_count = 100;

const game = new KeyboardNinja(main_element_id, carret_element_id, stats_holder_element_id);

const change_text_by_vocab_name = async (vocab_name) => {
  const length_input = document.getElementById("text_length");
  let length = length_input.value;

  //if (length < 10) length = 10;
  if (length > 100) length = 100;

  const text = await get_text_by_vocab_name(vocab_name, length);
  game.set_text(text);
};

set_vocabs(change_text_by_vocab_name);
