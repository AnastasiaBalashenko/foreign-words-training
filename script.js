const words = [
    { word: "Sand", translate: "песок", example: "The sand on this beach is so white!" },
    { word: "Sea", translate: "море", example: "The sea is very clean here." },
    { word: "Garden", translate: "сад", example: "What trees do you have in your garden?" },
    { word: "Road", translate: "дорога", example: "The road leads to a village." },
    { word: "Station", translate: "станция", example: "She is waiting for me at the station." },
    { word: "Land", translate: "земля", example: "We bought a piece of land to build a house there." },
    { word: "Neighbor", translate: "сосед", example: "I live peacefully with my neighbors" },
    { word: "Entrance", translate: "вход", example: "Wait for me at the entrance!" },
];

const card = document.querySelector(".flip-card");
const btnNext = document.querySelector('#next');
const btnBack = document.querySelector('#back');
const btnExam = document.querySelector('#exam');
const examCards = document.querySelector('#exam-cards');
const shuffleWords = document.querySelector('#shuffle-words');
const time = document.querySelector('#time');

let progress = 0;
let currentIndex = words.length;
let sec = 0,
    min = 0,
    firstCard = 0,
    secondCard = 0,
    firstCardIndex = 0,
    secondCardIndex = 0;
let endIndex = 0,
    click = false;
let timer;

const currentWords = [...words];

function makeCard({ word, translate, example }) {
    card.querySelector("#card-front h1").textContent = word;
    card.querySelector("#card-back h1").textContent = translate;
    card.querySelector("#card-back p span").textContent = example;
}

function renderCard(arr) {
    arr.forEach((item) => makeCard(item));
}

renderCard(currentWords);

function getRandomCard(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

shuffleWords.addEventListener('click', () => makeCard(getRandomCard(currentWords)));

function showProgress() {
    const wordProgress = progress * 25;
    const currentWord = progress + 1;
    document.querySelector('#words-progress').value = wordProgress;
    document.querySelector('#current-word').textContent = currentWord;
    makeCard(currentWords[progress]);
}

card.onclick = () => card.classList.toggle('active');

btnNext.onclick = () => {
    progress++;
    btnBack.disabled = false;
    if (progress === 4) btnNext.disabled = true;
    showProgress();
};

btnBack.onclick = () => {
    progress--;
    if (progress === 0) btnBack.disabled = true;
    if (progress < 5) btnNext.disabled = false;
    showProgress();
};

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function makeExamCard(key) {
    const item = document.createElement("div");
    item.className = 'card';
    item.textContent = key;
    return item;
}

function mixCards(arr) {
    const newArr = [];
    arr.forEach((item) => {
        newArr.push(makeExamCard(item.word));
        newArr.push(makeExamCard(item.translate));
    });
    return shuffle(newArr);
}

function renderExamCard(arr) {
    arr.forEach((item) => examCards.append(item));
}

function showExamProgress(value) {
    return Math.round(100 * (value + 1) / currentIndex);
}

btnExam.addEventListener('click', () => {
    card.classList.add('hidden');
    btnBack.classList.add('hidden');
    btnExam.classList.add('hidden');
    btnNext.classList.add('hidden');
    document.querySelector('#study-mode').classList.add('hidden');
    document.querySelector('#exam-mode').classList.remove('hidden');
    renderExamCard(mixCards(currentWords));

    timer = setInterval(() => {
        sec++;
        if (sec === 60) {
            sec = 0;
            min++;
        }
        time.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }, 1000);
});

examCards.addEventListener("click", (event) => {
    const card = event.target.closest(".card");

    if (!card || card.classList.contains("fade-out")) return;

    if (!click) {
        card.classList.add("correct");
        firstCard = card;
        firstCardIndex = currentWords.findIndex((item) => item.word === card.textContent || item.translate === card.textContent);
        click = true;
    } else {
        if (card === firstCard) return;

        secondCard = card;
        secondCardIndex = currentWords.findIndex((item) => item.word === card.textContent || item.translate === card.textContent);

        if (firstCardIndex === secondCardIndex) {
            document.querySelector('#correct-percent').textContent = `${showExamProgress(endIndex)}%`;
            document.querySelector('#exam-progress').value = showExamProgress(endIndex);
            endIndex++;
            firstCard.classList.add("fade-out");
            secondCard.classList.add("correct");
            secondCard.classList.add("fade-out");

            if (endIndex === currentIndex) {
                clearInterval(timer);
                document.querySelector('.motivation').textContent = 'Ты молодец, поздравляю✨';
            }
            click = false;
        } else {
            click = false;
            secondCard.classList.add("wrong");
            setTimeout(() => {
                firstCard.classList.remove("correct");
                secondCard.classList.remove("wrong");
            }, 500);
        }
    }
});