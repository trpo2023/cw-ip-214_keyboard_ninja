const fs = require("node:fs/promises");

const getVacabList = async () => {
  const vocabs = [];
  try {
    const filenames = await fs.readdir("./public/data/texts");
    return filenames;
  } catch (e) {
    console.log(e);
    return [];
  }
};

const getVocabs = async (req, res) => {
  const vocabs = {};
  const filenames = await getVacabList();

  for (let filename of filenames) {
    if (!filename.includes(".json")) continue;
    const lang_name = filename.split("_")[0];
    if (!lang_name) continue;

    if (vocabs[lang_name]) {
      vocabs[lang_name] = [...vocabs[lang_name], filename];
    } else {
      vocabs[lang_name] = [filename];
    }
  }

  return res.send(vocabs);
};

const getText = async (req, res) => {
  const { vocabulary } = req.query;
  if (!vocabulary) return res.status(400).send({ error: "No vocabulary" });
  const vocabs = await getVacabList();

  if (!Object.values(vocabs).includes(vocabulary)) {
    return res.status(400).send({ error: "No such vocabulary" });
  }

  try {
    const data = await fs.readFile(`./public/data/texts/${vocabulary}`, "utf8");
    return res.status(200).send(data);
  } catch (e) {
    console.error(e);
    return res.status(400).send({ error: "No such vocabulary" });
  }
};

module.exports = {
  getText,
  getVocabs,
};
