const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzQ9MncHHlMc3WFcQgdrp-2BfGI4YKuKN9F10e-izjC07OXAuGdgsvVUwbUEwzbr7M33Q/exec";

const radios = [
  {
    id: "lafan",
    name: "LA FAN",
    number: 90.5,
    subtitle: "POP • TOP HITS",
    theme: "lafan-theme",
    stream: "https://radio.megahostec.com/listen/radio_la_fan_fm/stream",
    logoVideo: "introlafanlogo.mp4",
    streaming: ""
  },
  {
    id: "clip",
    name: "CLIP",
    number: 80.5,
    subtitle: "MÚSICA • HITS",
    theme: "clip-theme",
    stream: "https://radio.megahostec.com/listen/radio_clipfm/stream",
    logoVideo: "introcliplogo.mp4",
    streaming: ""
  },
  {
    id: "oye",
    name: "OYE",
    number: 93.5,
    subtitle: "ENERGÍA • DIGITAL",
    theme: "oye-theme",
    stream: "https://radio.megahostec.com/listen/radio_oyefm/stream",
    logoVideo: "introoyelogo.mp4",
    streaming: ""
  },
  {
    id: "pox",
    name: "POX",
    number: 100.5,
    subtitle: "ENTRETENIMIENTO • LIVE",
    theme: "pox-theme",
    stream: "https://radio.megahostec.com/listen/radio_pox_edmo/stream",
    logoVideo: "poxvideo.mp4",
    streaming: ""
  }
];

let currentRadio = 0;
let isPlaying = false;
let currentNumber = 90.5;
let startX = 0;

const splashScreen = document.getElementById("splashScreen");
const splashVideo = document.getElementById("splashVideo");

const dialNumber = document.getElementById("dialNumber");
const dialRadioName = document.getElementById("dialRadioName");
const radioTitle = document.getElementById("radioTitle");
const radioNameTop = document.getElementById("radioNameTop");
const dialSubtitle = document.getElementById("dialSubtitle");
const dialWrapper = document.getElementById("dialWrapper");
const dialArea = document.getElementById("dialArea");

const radioLogoVideo = document.getElementById("radioLogoVideo");
const radioPlayer = document.getElementById("radioPlayer");
const playBtn = document.getElementById("playBtn");

const prevRadio = document.getElementById("prevRadio");
const nextRadio = document.getElementById("nextRadio");
const prevRadioBottom = document.getElementById("prevRadioBottom");
const nextRadioBottom = document.getElementById("nextRadioBottom");

const radioTab = document.getElementById("radioTab");
const streamingTab = document.getElementById("streamingTab");
const radioSection = document.getElementById("radioSection");
const streamingSection = document.getElementById("streamingSection");
const streamingFrame = document.getElementById("streamingFrame");

function hideSplash() {
  splashScreen.classList.add("hidden");
}

if (splashVideo && splashScreen) {
  splashVideo.play().catch(() => {});
  splashVideo.addEventListener("ended", hideSplash);
  setTimeout(hideSplash, 3500);
}

function convertToEmbedUrl(url) {
  if (!url) return "";

  url = url.trim();

  if (url.includes("youtube.com/watch?v=")) {
    const id = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("youtube.com/live/")) {
    const id = url.split("live/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
}

async function loadStreamingLinks() {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    const data = await response.json();

    if (data.success && data.radios) {
      radios.forEach(radio => {
        if (data.radios[radio.id]) {
          radio.streaming = data.radios[radio.id].streamVideo || "";
        }
      });
    }
  } catch (error) {
    console.log("No se pudo cargar Google Sheets.");
  }
}

function animateNumber(from, to) {
  const duration = 650;
  const start = performance.now();

  function step(time) {
    const progress = Math.min((time - start) / duration, 1);
    const value = from + (to - from) * progress;

    dialNumber.textContent = value.toFixed(1);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      dialNumber.textContent = to.toFixed(1);
      currentNumber = to;
    }
  }

  requestAnimationFrame(step);
}

function loadRadio(index) {
  const radio = radios[index];

  document.body.className = radio.theme;

  dialWrapper.classList.remove("spin");
  void dialWrapper.offsetWidth;
  dialWrapper.classList.add("spin");

  animateNumber(currentNumber, radio.number);

  dialRadioName.textContent = radio.name;
  radioTitle.textContent = radio.name;
  radioNameTop.textContent = radio.name;
  dialSubtitle.textContent = radio.subtitle;

  radioLogoVideo.src = radio.logoVideo;
  radioLogoVideo.load();

  radioPlayer.src = radio.stream;
  radioPlayer.load();

  const streamUrl = convertToEmbedUrl(radio.streaming);
  streamingFrame.src = streamUrl || "";

  if (isPlaying) {
    radioPlayer.play().catch(() => {});
  }
}

function changeRadio(direction) {
  currentRadio = (currentRadio + direction + radios.length) % radios.length;
  loadRadio(currentRadio);
}

playBtn.addEventListener("click", async () => {
  if (!isPlaying) {
    try {
      await radioPlayer.play();
      isPlaying = true;
      playBtn.innerHTML = "❚❚";
    } catch (error) {
      isPlaying = false;
      playBtn.innerHTML = "▶";
    }
  } else {
    radioPlayer.pause();
    isPlaying = false;
    playBtn.innerHTML = "▶";
  }
});

nextRadio.addEventListener("click", () => changeRadio(1));
prevRadio.addEventListener("click", () => changeRadio(-1));
nextRadioBottom.addEventListener("click", () => changeRadio(1));
prevRadioBottom.addEventListener("click", () => changeRadio(-1));

radioTab.addEventListener("click", () => {
  streamingTab.classList.remove("active-switch");
  radioTab.classList.add("active-switch");
  streamingSection.classList.add("hidden");
  radioSection.classList.remove("hidden");
});

streamingTab.addEventListener("click", () => {
  radioTab.classList.remove("active-switch");
  streamingTab.classList.add("active-switch");
  radioSection.classList.add("hidden");
  streamingSection.classList.remove("hidden");
});

dialArea.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

dialArea.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 45) {
    if (diff > 0) changeRadio(1);
    else changeRadio(-1);
  }
});

dialArea.addEventListener("mousedown", (e) => {
  startX = e.clientX;
});

dialArea.addEventListener("mouseup", (e) => {
  const endX = e.clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 45) {
    if (diff > 0) changeRadio(1);
    else changeRadio(-1);
  }
});

loadStreamingLinks().then(() => {
  loadRadio(currentRadio);
});
