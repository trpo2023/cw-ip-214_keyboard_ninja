const axios = require("axios");

const url = "http://localhost:3000/api/";

describe("api test", () => {
  test("test get_vocabs endpoint", async () => {
    await axios.get(url + "get_vocabs");
  });

  test("test get text endpoint", async () => {
    const vocab_response = await axios.get(url + "get_vocabs");
    const vocabs = Object.values(vocab_response.data);
    for (let i = 0; i < vocabs.length; i++) {
      const vocab = vocabs[i];
      for (let j = 0; j < vocab.length; j++) {
        await axios.get(url + "get_text?vocabulary=" + vocab[j]);
      }
    }
  });
});
