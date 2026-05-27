const playBtn = document.getElementById("playBtn");
const radioPlayer = document.getElementById("radioPlayer");
const visualizer = document.querySelector(".visualizer");

const mainTitle = document.getElementById("mainTitle");
const mainSubtitle = document.getElementById("mainSubtitle");
const radioTitle = document.getElementById("radioTitle");
const radioText = document.getElementById("radioText");
const coverBox = document.getElementById("coverBox");
const playerCard = document.getElementById("playerCard");

const splashScreen = document.getElementById("splashScreen");
const splashVideo = document.getElementById("splashVideo");
const dots = document.querySelectorAll(".dot");

const prevRadioBtn = document.getElementById("prevRadioBtn");
const nextRadioBtn = document.getElementById("nextRadioBtn");

let isPlaying = false;
let currentIndex = 0;
let startX = 0;
let endX = 0;

const radios = [
  {
    name: "LA FAN FM",
    theme: "lafan-theme",
    stream: "https://radio.megahostec.com/listen/radio_la_fan_fm/stream",
    video: "introlafanlogo.mp4",
    subtitle: "Tu radio en vivo, música y energía en un solo lugar."
  },
  {
    name: "CLIP FM",
    theme: "clip-theme",
    stream: "https://radio.megahostec.com/listen/radio_clipfm/stream",
    video: "introcliplogo.mp4",
    subtitle: "La radio con ritmo, frescura y buena música."
  },
  {
    name: "OYE FM",
    theme: "oye-theme",
    stream: "https://radio.megahostec.com/listen/radio_oyefm/stream",
    video: "introoyelogo.mp4",
    subtitle: "La radio joven, dinámica y llena de energía."
  },
  {
    name: "POX FM",
    theme: "pox-theme",
    stream: "https://radio.megahostec.com/listen/radio_pox_edmo/stream",
    video: "intropoxlogo.mp4",
    subtitle: "Música, entretenimiento y energía en vivo."
  }
];

function hideSplash() {
  splashScreen.classList.add("hide");
}

if (splashVideo && splashScreen) {
  splashVideo.play().catch(() => {});
  splashVideo.addEventListener("ended", hideSplash);

  setTimeout(() => {
    hideSplash();
  }, 6000);
}

function stopRadio() {
  radioPlayer.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
  playBtn.classList.remove("playing");
  visualizer.classList.remove("active");
}

async function playRadio() {
  try {
    await radioPlayer.play();

    isPlaying = true;
    playBtn.textContent = "❚❚";
    playBtn.classList.add("playing");
    visualizer.classList.add("active");

  } catch (error) {
    isPlaying = false;
    playBtn.textContent = "▶";
    playBtn.classList.remove("playing");
    visualizer.classList.remove("active");
  }
}

function updateDots() {
  dots.forEach((dot, index) => {
    dot.classList.toggle("active-dot", index === currentIndex);
  });
}

async function changeRadio(index) {
  currentIndex = (index + radios.length) % radios.length;

  const radio = radios[currentIndex];

  document.body.className = radio.theme;

  mainTitle.textContent = radio.name;
  mainSubtitle.textContent = radio.subtitle;
  radioTitle.textContent = radio.name;
  radioText.textContent = "Escucha la radio online desde cualquier lugar.";

  coverBox.innerHTML = `
    <video
      id="coverMedia"
      autoplay
      muted
      loop
      playsinline
      src="${radio.video}">
    </video>
  `;

  const wasPlaying = isPlaying;

  radioPlayer.pause();
  radioPlayer.src = radio.stream;
  radioPlayer.load();

  updateDots();

  if (wasPlaying) {
    await playRadio();
  } else {
    stopRadio();
  }
}

playBtn.addEventListener("click", async () => {
  if (!isPlaying) {
    await playRadio();
  } else {
    stopRadio();
  }
});

nextRadioBtn.addEventListener("click", async () => {
  await changeRadio(currentIndex + 1);
});

prevRadioBtn.addEventListener("click", async () => {
  await changeRadio(currentIndex - 1);
});

playerCard.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

playerCard.addEventListener("touchend", async (e) => {
  endX = e.changedTouches[0].clientX;

  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      await changeRadio(currentIndex + 1);
    } else {
      await changeRadio(currentIndex - 1);
    }
  }
});

playerCard.addEventListener("mousedown", (e) => {
  startX = e.clientX;
});

playerCard.addEventListener("mouseup", async (e) => {
  endX = e.clientX;

  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      await changeRadio(currentIndex + 1);
    } else {
      await changeRadio(currentIndex - 1);
    }
  }
});

updateDots();
