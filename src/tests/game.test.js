const game = require('../public/scripts/keyboard_ninja');

describe("test game module", () => {
    test("check all letters of russian alphabet", () => {
      const lower_letters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
      const upper_letter = lower_letters.toUpperCase();
      const all_letters = lower_letters + upper_letter;

      for (let i = 0; i < all_letters.length; i++) {
        const letter = all_letters[i];

        expect(game.isNonSystemSymbol(letter)).toBe(true);
      }
    });

    test("check special symbol", () => {
        const special_symbol = ' !@#$%^&*()~_+{}|./\'"№;:?-[]\\<>';
  
        for (let i = 0; i < special_symbol.length; i++) {
          const letter = special_symbol[i];
  
          expect(game.isNonSystemSymbol(letter)).toBe(true);
        }
    });

    test("check all letters of english alphabet", () => {
        const lower_letters = 'abcdefghijklmnopqrstuvwxyz';
        const upper_letter = lower_letters.toUpperCase();
        const all_letters = lower_letters + upper_letter;

        for (let i = 0; i < all_letters.length; i++) {
        const letter = all_letters[i];

        expect(game.isNonSystemSymbol(letter)).toBe(true);
        }
    });

    test("check HTML whitespace replace", () => {
        const whitespace = ' ';
  
        expect(game.replace_space(whitespace)).toBe("&nbsp;");
        expect(game.replace_space("f")).toBe("f");
    });
});