const select = document.getElementById("vocab_select");
const main_element_id = "main_text";
const game = new KeyboardNinja(main_element_id);
const max_word_count = 100;

set_vocabs();

select.addEventListener("change", async (event) => {
  const selected_value = event.target.value;
  const length_input = document.getElementById("text_length");
  let length = length_input.value;

  if (length < 10) length = 10;
  if (length > 100) length = 100;

  const text = await get_text_by_vocab_name(selected_value, length);
  game.set_text(text);
});
