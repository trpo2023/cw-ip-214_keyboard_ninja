async function set_vocabs() {
    const response = await fetch('http://localhost:3000/api/get_vocabs');
    const data = await response.json();
    const vocabs = Array.prototype.concat.apply([], Object.values(data));

    const select = document.getElementById('vocab_select');
    for (let i = 0; i < vocabs.length; i++) {
        const option = document.createElement('option');
        option.innerText = vocabs[i];
        select.appendChild(option);
    }
}

async function get_text_by_vocab_name(vocab_name, length) {
    const response = await fetch(`http://localhost:3000/api/get_text?vocabulary=${vocab_name}`);
    const data = await response.json();
    const words = data['words'];

    let text = "";
    for (let i = 0; i < length; i++) {
        let rnd = Math.round(Math.random() * words.length);
        console.log(rnd);
        let word = words[rnd];
        text += word + (i < (length - 1) ? ' ' : '');
    }

    return text;
}