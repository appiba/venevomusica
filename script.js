const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzQ9MncHHlMc3WFcQgdrp-2BfGI4YKuKN9F10e-izjC07OXAuGdgsvVUwbUEwzbr7M33Q/exec";

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

const prevRadioBtn = document.getElementById("prevRadioBtn");
const nextRadioBtn = document.getElementById("nextRadioBtn");

const radioModeBtn = document.getElementById("radioModeBtn");
const streamingModeBtn = document.getElementById("streamingModeBtn");
const radioModeBox = document.getElementById("radioModeBox");
const streamingModeBox = document.getElementById("streamingModeBox");
const streamingContent = document.getElementById("streamingContent");

let isPlaying = false;
let currentIndex = 0;
let startX = 0;
let endX = 0;
let currentMode = "radio";

let radios = [
  {
    id: "lafan",
    nombre: "LA FAN FM",
    tema: "lafan-theme",
    streamRadio: "https://radio.megahostec.com/listen/radio_la_fan_fm/stream",
    streamVideo: "",
    videoLogo: "introlafanlogo.mp4",
    subtitulo: "Tu radio en vivo, música y energía en un solo lugar."
  },
  {
    id: "clip",
    nombre: "CLIP FM",
    tema: "clip-theme",
    streamRadio: "https://radio.megahostec.com/listen/radio_clipfm/stream",
    streamVideo: "",
    videoLogo: "introcliplogo.mp4",
    subtitulo: "La radio con ritmo, frescura y buena música."
  },
  {
    id: "oye",
    nombre: "OYE FM",
    tema: "oye-theme",
    streamRadio: "https://radio.megahostec.com/listen/radio_oyefm/stream",
    streamVideo: "",
    videoLogo: "introoyelogo.mp4",
    subtitulo: "La radio joven, dinámica y llena de energía."
  },
  {
    id: "pox",
    nombre: "POX FM",
    tema: "pox-theme",
    streamRadio: "https://radio.megahostec.com/listen/radio_pox_edmo/stream",
    streamVideo: "",
    videoLogo: "poxvideo.mp4",
    subtitulo: "Música, entretenimiento y energía en vivo."
  }
];

function hideSplash() {
  splashScreen.classList.add("hide");
}

if (splashVideo && splashScreen) {
  splashVideo.play().catch(() => {});
  splashVideo.addEventListener("ended", hideSplash);
  setTimeout(hideSplash, 6000);
}

async function loadStreamingLinks() {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    const data = await response.json();

    if (data.success && data.radios) {
      radios = radios.map(radio => {
        if (data.radios[radio.id]) {
          return {
            ...radio,
            streamVideo: data.radios[radio.id].streamVideo || ""
          };
        }
        return radio;
      });

      changeRadio(currentIndex, false);
    }
  } catch (error) {
    console.log("No se pudo cargar streaming desde Google Sheets.");
  }
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
  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.toggle("active-dot", index === currentIndex);
  });
}

function updateStreamingBox(radio) {
  const url = (radio.streamVideo || "").trim();

  if (!url) {
    streamingContent.innerHTML = `<p>Streaming no disponible por el momento.</p>`;
    return;
  }

  streamingContent.innerHTML = `
    <iframe
      src="${url}"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
}

function changeRadio(index, keepPlaying = true) {
  currentIndex = (index + radios.length) % radios.length;
  const radio = radios[currentIndex];

  document.body.className = radio.tema;

  mainTitle.textContent = radio.nombre;
  mainSubtitle.textContent = radio.subtitulo;
  radioTitle.textContent = radio.nombre;
  radioText.textContent = "Escucha la radio online desde cualquier lugar.";

  coverBox.innerHTML = `
    <video
      autoplay
      muted
      loop
      playsinline
      src="${radio.videoLogo}">
    </video>
  `;

  const wasPlaying = isPlaying;

  radioPlayer.pause();
  radioPlayer.src = radio.streamRadio;
  radioPlayer.load();

  updateStreamingBox(radio);
  updateDots();

  if (currentMode === "radio" && keepPlaying && wasPlaying) {
    playRadio();
  } else {
    stopRadio();
  }
}

function setMode(mode) {
  currentMode = mode;

  if (mode === "radio") {
    radioModeBtn.classList.add("active-mode");
    streamingModeBtn.classList.remove("active-mode");
    radioModeBox.classList.remove("hidden");
    streamingModeBox.classList.add("hidden");
  }

  if (mode === "streaming") {
    stopRadio();
    streamingModeBtn.classList.add("active-mode");
    radioModeBtn.classList.remove("active-mode");
    radioModeBox.classList.add("hidden");
    streamingModeBox.classList.remove("hidden");
    updateStreamingBox(radios[currentIndex]);
  }
}

playBtn.addEventListener("click", async () => {
  if (isPlaying) {
    stopRadio();
  } else {
    await playRadio();
  }
});

nextRadioBtn.addEventListener("click", () => {
  changeRadio(currentIndex + 1);
});

prevRadioBtn.addEventListener("click", () => {
  changeRadio(currentIndex - 1);
});

radioModeBtn.addEventListener("click", () => {
  setMode("radio");
});

streamingModeBtn.addEventListener("click", () => {
  setMode("streaming");
});

playerCard.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

playerCard.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      changeRadio(currentIndex + 1);
    } else {
      changeRadio(currentIndex - 1);
    }
  }
});

playerCard.addEventListener("mousedown", (e) => {
  startX = e.clientX;
});

playerCard.addEventListener("mouseup", (e) => {
  endX = e.clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      changeRadio(currentIndex + 1);
    } else {
      changeRadio(currentIndex - 1);
    }
  }
});

updateDots();
changeRadio(0, false);
loadStreamingLinks();
