const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzQ9MncHHlMc3WFcQgdrp-2BfGI4YKuKN9F10e-izjC07OXAuGdgsvVUwbUEwzbr7M33Q/exec";

const radios = [
  {
    id: "lafan",
    name: "LA FAN",
    number: 90.5,
    subtitle: "POP · TOP HITS",
    theme: "lafan-theme",
    stream: "https://radio.megahostec.com/listen/radio_la_fan_fm/stream",
    metadataApi: "https://radio.megahostec.com/api/nowplaying/radio_la_fan_fm",
    logoVideo: "introlafanlogo.mp4",
    streaming: ""
  },
  {
    id: "clip",
    name: "CLIP",
    number: 80.5,
    subtitle: "MÚSICA · HITS",
    theme: "clip-theme",
    stream: "https://radio.megahostec.com/listen/radio_clipfm/stream",
    metadataApi: "https://radio.megahostec.com/api/nowplaying/radio_clipfm",
    logoVideo: "introcliplogo.mp4",
    streaming: ""
  },
  {
    id: "oye",
    name: "OYE",
    number: 93.5,
    subtitle: "ENERGÍA · DIGITAL",
    theme: "oye-theme",
    stream: "https://radio.megahostec.com/listen/radio_oyefm/stream",
    metadataApi: "https://radio.megahostec.com/api/nowplaying/radio_oyefm",
    logoVideo: "introoyelogo.mp4",
    streaming: ""
  },
  {
    id: "pox",
    name: "POX",
    number: 100.5,
    subtitle: "ENTRETENIMIENTO · LIVE",
    theme: "pox-theme",
    stream: "https://radio.megahostec.com/listen/radio_pox_edmo/stream",
    metadataApi: "https://radio.megahostec.com/api/nowplaying/radio_pox_edmo",
    logoVideo: "poxvideo.mp4",
    streaming: ""
  }
];

let currentRadio = 0;
let isPlaying = false;
let currentNumber = 90.5;
let startX = 0;
let listeners = 2853;

let audioContext = null;
let analyser = null;
let sourceNode = null;
let analyserReady = false;
let fakeVisualizerInterval = null;

let nowPlayingInterval = null;

const splashScreen = document.getElementById("splashScreen");
const splashVideo = document.getElementById("splashVideo");

const menuBtn = document.getElementById("menuBtn");
const sideDrawer = document.getElementById("sideDrawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");

const liveStatus = document.getElementById("liveStatus");
const listenersCount = document.getElementById("listenersCount");

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

const radioModeBtn = document.getElementById("radioModeBtn");
const streamingModeBtn = document.getElementById("streamingModeBtn");
const radioModeBox = document.getElementById("radioModeBox");
const streamingModeBox = document.getElementById("streamingModeBox");
const streamingContent = document.getElementById("streamingContent");

const shareBtn = document.getElementById("shareBtn");
const drawerShareBtn = document.getElementById("drawerShareBtn");
const moreShareBtn = document.getElementById("moreShareBtn");

const favoriteBtn = document.getElementById("favoriteBtn");
const favoritesList = document.getElementById("favoritesList");

const volumeBtn = document.getElementById("volumeBtn");
const volumePanel = document.getElementById("volumePanel");
const volumeSlider = document.getElementById("volumeSlider");

const nowPlayingBox = document.getElementById("nowPlayingBox");
const nowCover = document.getElementById("nowCover");
const nowTitle = document.getElementById("nowTitle");
const nowArtist = document.getElementById("nowArtist");

const audioBars = document.querySelectorAll("#audioBars span");
const bottomTabs = document.querySelectorAll(".bottom-tab");
const views = document.querySelectorAll(".view");
const bottomStreamingBtn = document.getElementById("bottomStreamingBtn");

/* SPLASH */

function hideSplash() {
  if (splashScreen) {
    splashScreen.classList.add("hidden");
  }
}

if (splashVideo && splashScreen) {
  splashVideo.play().catch(() => {});
  splashVideo.addEventListener("ended", hideSplash);
  setTimeout(hideSplash, 3500);
}

/* GOOGLE SHEETS STREAMING */

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

  if (url.includes("facebook.com")) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
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

/* LIVE STATUS */

function setLiveStatus(type, label) {
  if (!liveStatus) return;

  liveStatus.className = `live-status ${type}`;
  const labelBox = liveStatus.querySelector("b");

  if (labelBox) {
    labelBox.textContent = label;
  }
}

radioPlayer.addEventListener("waiting", () => setLiveStatus("connecting", "CONECTANDO"));
radioPlayer.addEventListener("loadstart", () => setLiveStatus("connecting", "CARGANDO"));
radioPlayer.addEventListener("playing", () => setLiveStatus("playing", "EN VIVO"));
radioPlayer.addEventListener("pause", () => setLiveStatus("paused", "PAUSADO"));
radioPlayer.addEventListener("error", () => setLiveStatus("error", "SIN SEÑAL"));

/* DIAL */

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

function spinDial() {
  dialWrapper.classList.remove("spin");
  void dialWrapper.offsetWidth;
  dialWrapper.classList.add("spin");
}

function updateTopIdentity(radio) {
  if (radio.id === "lafan") {
    radioNameTop.textContent = "LA FAN";
  } else if (radio.id === "oye") {
    radioNameTop.textContent = "OYE";
  } else {
    radioNameTop.textContent = `${radio.name} FD`;
  }
}

function loadRadio(index) {
  const radio = radios[index];

  document.body.className = radio.theme;

  spinDial();
  animateNumber(currentNumber, radio.number);

  updateTopIdentity(radio);

  dialRadioName.textContent = `${radio.name} FM`;
  radioTitle.textContent = radio.name;
  dialSubtitle.textContent = radio.subtitle;

  radioLogoVideo.src = radio.logoVideo;
  radioLogoVideo.load();

  radioPlayer.src = radio.stream;
  radioPlayer.load();

  updateFavoriteButton();
  updateStreamingBox();

  loadNowPlaying();
  startNowPlayingUpdater();

  if (isPlaying) {
    radioPlayer.play().catch(() => {});
  }
}

function changeRadio(direction) {
  currentRadio = (currentRadio + direction + radios.length) % radios.length;
  loadRadio(currentRadio);
}

/* PLAYER */

async function playRadio() {
  try {
    await initAudioVisualizer();
    await radioPlayer.play();

    isPlaying = true;
    playBtn.innerHTML = "❚❚";
    setLiveStatus("playing", "EN VIVO");
  } catch (error) {
    isPlaying = false;
    playBtn.innerHTML = "▶";
    setLiveStatus("error", "SIN SEÑAL");
  }
}

function pauseRadio() {
  radioPlayer.pause();
  isPlaying = false;
  playBtn.innerHTML = "▶";
  setLiveStatus("paused", "PAUSADO");
}

playBtn.addEventListener("click", async () => {
  if (!isPlaying) {
    await playRadio();
  } else {
    pauseRadio();
  }
});

/* RADIO NAVIGATION */

nextRadio.addEventListener("click", () => changeRadio(1));
prevRadio.addEventListener("click", () => changeRadio(-1));
nextRadioBottom.addEventListener("click", () => changeRadio(1));
prevRadioBottom.addEventListener("click", () => changeRadio(-1));

dialArea.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

dialArea.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 45) {
    diff > 0 ? changeRadio(1) : changeRadio(-1);
  }
});

dialArea.addEventListener("mousedown", e => {
  startX = e.clientX;
});

dialArea.addEventListener("mouseup", e => {
  const endX = e.clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 45) {
    diff > 0 ? changeRadio(1) : changeRadio(-1);
  }
});

/* STREAMING */

function updateStreamingBox() {
  const radio = radios[currentRadio];
  const url = convertToEmbedUrl(radio.streaming);

  if (!url) {
    streamingContent.innerHTML = `<p>Streaming no disponible por el momento.</p>`;
    return;
  }

  streamingContent.innerHTML = `
    <iframe
      src="${url}"
      title="Streaming"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen>
    </iframe>
  `;
}

function setMode(mode) {
  if (mode === "radio") {
    streamingModeBtn.classList.remove("active-mode");
    radioModeBtn.classList.add("active-mode");
    streamingModeBox.classList.add("hidden");
    radioModeBox.classList.remove("hidden");
  }

  if (mode === "streaming") {
    pauseRadio();

    radioModeBtn.classList.remove("active-mode");
    streamingModeBtn.classList.add("active-mode");
    radioModeBox.classList.add("hidden");
    streamingModeBox.classList.remove("hidden");

    updateStreamingBox();
  }
}

radioModeBtn.addEventListener("click", () => setMode("radio"));
streamingModeBtn.addEventListener("click", () => setMode("streaming"));

/* BOTTOM NAV */

function showView(viewId) {
  views.forEach(view => view.classList.remove("active-view"));

  const target = document.getElementById(viewId);
  if (target) target.classList.add("active-view");

  bottomTabs.forEach(tab => {
    tab.classList.toggle("active-tab", tab.dataset.view === viewId);
  });
}

bottomTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const viewId = tab.dataset.view;

    showView(viewId);

    if (tab === bottomStreamingBtn) {
      setMode("streaming");
    }

    if (viewId === "radioView" && tab !== bottomStreamingBtn) {
      setMode("radio");
    }

    if (viewId === "favoritesView") {
      renderFavorites();
    }
  });
});

/* DRAWER */

function openDrawer() {
  sideDrawer.classList.add("open");
  drawerOverlay.classList.add("show");
}

function closeDrawer() {
  sideDrawer.classList.remove("open");
  drawerOverlay.classList.remove("show");
}

menuBtn.addEventListener("click", openDrawer);
closeDrawerBtn.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

/* SHARE */

async function shareCurrentRadio() {
  const radio = radios[currentRadio];

  const shareData = {
    title: `Venevo Música - ${radio.name}`,
    text: `Escucha ${radio.name} en Venevo Música.`,
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado.");
    }
  } catch (error) {
    console.log("No se pudo compartir.");
  }
}

shareBtn.addEventListener("click", shareCurrentRadio);
drawerShareBtn.addEventListener("click", shareCurrentRadio);
moreShareBtn.addEventListener("click", shareCurrentRadio);

/* FAVORITES */

function getFavorites() {
  return JSON.parse(localStorage.getItem("venevoFavorites") || "[]");
}

function saveFavorites(favorites) {
  localStorage.setItem("venevoFavorites", JSON.stringify(favorites));
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function updateFavoriteButton() {
  const radio = radios[currentRadio];

  if (isFavorite(radio.id)) {
    favoriteBtn.classList.add("favorite-active");
  } else {
    favoriteBtn.classList.remove("favorite-active");
  }
}

favoriteBtn.addEventListener("click", () => {
  const radio = radios[currentRadio];
  let favorites = getFavorites();

  if (favorites.includes(radio.id)) {
    favorites = favorites.filter(id => id !== radio.id);
  } else {
    favorites.push(radio.id);
  }

  saveFavorites(favorites);
  updateFavoriteButton();
});

function renderFavorites() {
  const favorites = getFavorites();
  favoritesList.innerHTML = "";

  if (favorites.length === 0) {
    favoritesList.innerHTML = `
      <div class="news-card">
        <h3>No tienes favoritos todavía</h3>
        <p>Agrega una radio tocando el corazón en el reproductor.</p>
      </div>
    `;
    return;
  }

  favorites.forEach(id => {
    const radio = radios.find(r => r.id === id);
    if (!radio) return;

    const item = document.createElement("button");
    item.className = "favorite-item";
    item.innerHTML = `
      <h3>${radio.name} FM</h3>
      <p>${radio.number.toFixed(1)} FD · ${radio.subtitle}</p>
    `;

    item.addEventListener("click", () => {
      currentRadio = radios.findIndex(r => r.id === id);
      loadRadio(currentRadio);
      showView("radioView");
      setMode("radio");
    });

    favoritesList.appendChild(item);
  });
}

/* VOLUME */

function setupVolume() {
  radioPlayer.volume = 1;
  volumeSlider.value = "1";

  if (!document.querySelector(".volume-label")) {
    const volumeInfo = document.createElement("div");
    volumeInfo.className = "volume-label";
    volumeInfo.innerHTML = `
      Volumen interno de Venevo.<br>
      Usa los botones del teléfono para el volumen general.
    `;
    volumePanel.prepend(volumeInfo);
  }

  volumeBtn.onclick = () => {
    volumePanel.classList.toggle("hidden");
  };

  volumeSlider.oninput = () => {
    const volume = Number(volumeSlider.value);
    radioPlayer.volume = volume;
  };

  volumeSlider.addEventListener("touchstart", e => {
    e.stopPropagation();
  }, { passive: true });

  volumeSlider.addEventListener("touchmove", e => {
    e.preventDefault();
    e.stopPropagation();

    const rect = volumeSlider.getBoundingClientRect();
    const touch = e.touches[0];

    let percent = (touch.clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));

    volumeSlider.value = percent.toFixed(2);
    radioPlayer.volume = percent;
  }, { passive: false });
}

/* NOW PLAYING */

async function loadNowPlaying() {
  const radio = radios[currentRadio];

  if (!nowPlayingBox || !nowTitle || !nowArtist || !nowCover) return;

  nowTitle.textContent = "Cargando canción...";
  nowArtist.textContent = radio.name;
  nowCover.src = "";
  nowCover.parentElement.classList.remove("has-cover");

  if (!radio.metadataApi) {
    nowTitle.textContent = radio.name;
    nowArtist.textContent = radio.subtitle;
    return;
  }

  try {
    const response = await fetch(`${radio.metadataApi}?t=${Date.now()}`, {
      cache: "no-store"
    });

    const data = await response.json();

    const song = data?.now_playing?.song || null;

    const title =
      song?.title ||
      song?.text ||
      "Canción no disponible";

    const artist =
      song?.artist ||
      data?.now_playing?.song?.artist ||
      "Artista no disponible";

    const art =
      song?.art ||
      data?.now_playing?.song?.art ||
      "";

    nowTitle.textContent = title;
    nowArtist.textContent = artist;

    if (art) {
      nowCover.src = art;
      nowCover.parentElement.classList.add("has-cover");
    } else {
      nowCover.src = "";
      nowCover.parentElement.classList.remove("has-cover");
    }

  } catch (error) {
    nowTitle.textContent = radio.name;
    nowArtist.textContent = "Información no disponible";
    nowCover.src = "";
    nowCover.parentElement.classList.remove("has-cover");
  }
}

function startNowPlayingUpdater() {
  if (nowPlayingInterval) {
    clearInterval(nowPlayingInterval);
  }

  loadNowPlaying();

  nowPlayingInterval = setInterval(() => {
    loadNowPlaying();
  }, 15000);
}

/* LIVE ACTIVITY */

function updateListeners() {
  const variation = Math.floor(Math.random() * 420);
  const up = Math.random() > 0.5;

  listeners = up ? listeners + variation : listeners - variation;

  if (listeners < 1200) listeners = 1200;
  if (listeners > 5200) listeners = 3600;

  listenersCount.textContent = `${listeners.toLocaleString("es-ES")} conectados`;
}

setInterval(updateListeners, 3500);

/* AUDIO VISUALIZER */

async function initAudioVisualizer() {
  if (analyserReady) return;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    sourceNode = audioContext.createMediaElementSource(radioPlayer);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;

    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);

    analyserReady = true;
    animateRealVisualizer();

  } catch (error) {
    startFakeVisualizer();
  }
}

function animateRealVisualizer() {
  if (!analyser) return;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function draw() {
    analyser.getByteFrequencyData(dataArray);

    audioBars.forEach((bar, index) => {
      const value = dataArray[index * 4] || 8;
      const height = Math.max(8, Math.min(32, value / 4));
      bar.style.height = `${height}px`;
    });

    requestAnimationFrame(draw);
  }

  draw();
}

function startFakeVisualizer() {
  if (fakeVisualizerInterval) return;

  fakeVisualizerInterval = setInterval(() => {
    audioBars.forEach(bar => {
      const height = Math.floor(Math.random() * 28) + 8;
      bar.style.height = `${height}px`;
    });
  }, 180);
}

/* INIT */

setupVolume();

loadStreamingLinks().then(() => {
  loadRadio(currentRadio);
  renderFavorites();
});
