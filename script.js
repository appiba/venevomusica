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
    logoCarro: "logolafancarro.png",
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
    logoCarro: "logoclipcarro.png",
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
    logoCarro: "logooyecarro.png",
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
    logoCarro: "logopoxcarro.png",
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

let realVisualizerFrame = null;
let fakeVisualizerInterval = null;

let nowPlayingInterval = null;
let currentCoverUrl = "";

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
const radioNameTop = document.getElementById("radioNameTop");
const dialSubtitle = document.getElementById("dialSubtitle");
const dialWrapper = document.getElementById("dialWrapper");
const dialArea = document.getElementById("dialArea");

const prevPreviewNumber = document.getElementById("prevPreviewNumber");
const prevPreviewName = document.getElementById("prevPreviewName");
const prevPreviewSubtitle = document.getElementById("prevPreviewSubtitle");
const nextPreviewNumber = document.getElementById("nextPreviewNumber");
const nextPreviewName = document.getElementById("nextPreviewName");
const nextPreviewSubtitle = document.getElementById("nextPreviewSubtitle");
const prevRadioPreview = document.getElementById("prevRadioPreview");
const nextRadioPreview = document.getElementById("nextRadioPreview");

const radioLogoVideo = document.getElementById("radioLogoVideo");
const radioPlayer = document.getElementById("radioPlayer");
const playBtn = document.getElementById("playBtn");

const prevRadio = document.getElementById("prevRadio");
const nextRadio = document.getElementById("nextRadio");
const prevRadioBottom = document.getElementById("prevRadioBottom");
const nextRadioBottom = document.getElementById("nextRadioBottom");

const radioModeBtn = document.getElementById("radioModeBtn");
const streamingModeBtn = document.getElementById("streamingModeBtn");
const streamingRadioModeBtn = document.getElementById("streamingRadioModeBtn");
const streamingStreamingModeBtn = document.getElementById("streamingStreamingModeBtn");

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

const nowCover = document.getElementById("nowCover");
const nowArtistBox = document.getElementById("nowArtistBox");
const nowArtistMain = document.getElementById("nowArtistMain");
const nowTitleBox = document.getElementById("nowTitleBox");
const nowTitle = document.getElementById("nowTitle");
const songProgressFill = document.getElementById("songProgressFill");
const songElapsed = document.getElementById("songElapsed");
const songDuration = document.getElementById("songDuration");
const songCoverMain = document.getElementById("songCoverMain");

const audioBarsContainer = document.getElementById("audioBars");
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
  } else if (radio.id === "clip") {
    radioNameTop.textContent = "CLIP";
  } else if (radio.id === "oye") {
    radioNameTop.textContent = "OYE";
  } else if (radio.id === "pox") {
    radioNameTop.textContent = "POX";
  } else {
    radioNameTop.textContent = `${radio.name} FD`;
  }
}

function formatPreviewNumber(number) {
  if (typeof number === "number") {
    return number.toFixed(1);
  }

  return String(number || "");
}

function updateRadioPreviews() {
  const prevIndex = (currentRadio - 1 + radios.length) % radios.length;
  const nextIndex = (currentRadio + 1) % radios.length;

  const prev = radios[prevIndex];
  const next = radios[nextIndex];

  if (prevPreviewNumber) {
    prevPreviewNumber.textContent = formatPreviewNumber(prev.number);
  }

  if (prevPreviewName) {
    prevPreviewName.textContent = prev.name;
  }

  if (prevPreviewSubtitle) {
    prevPreviewSubtitle.textContent = prev.subtitle;
  }

  if (nextPreviewNumber) {
    nextPreviewNumber.textContent = formatPreviewNumber(next.number);
  }

  if (nextPreviewName) {
    nextPreviewName.textContent = next.name;
  }

  if (nextPreviewSubtitle) {
    nextPreviewSubtitle.textContent = next.subtitle;
  }

  if (prevRadioPreview) {
    prevRadioPreview.dataset.radio = prev.id;
  }

  if (nextRadioPreview) {
    nextRadioPreview.dataset.radio = next.id;
  }
}

function resetSongCoverToVideo() {
  currentCoverUrl = "";

  if (nowCover) {
    nowCover.removeAttribute("src");
  }

  if (songCoverMain) {
    songCoverMain.classList.remove("has-cover");
  }
}

function loadRadio(index) {
  const radio = radios[index];

  document.body.className = radio.theme;

  spinDial();
  animateNumber(currentNumber, radio.number);

  updateTopIdentity(radio);
  updateRadioPreviews();

  dialRadioName.textContent = `${radio.name} FM`;
  dialSubtitle.textContent = radio.subtitle;

  resetSongCoverToVideo();

  radioLogoVideo.src = radio.logoVideo;
  radioLogoVideo.load();

  radioPlayer.src = radio.stream;
  radioPlayer.load();

  updateFavoriteButton();
  updateStreamingBox();

  updateMediaSession(
    `${radio.name} FM`,
    "Venevo Música",
    radio.logoCarro
  );

  loadNowPlaying();
  startNowPlayingUpdater();

  if (isPlaying) {
    radioPlayer.play().then(() => {
      startVisualizer();
    }).catch(() => {
      startVisualizer();
    });
  } else {
    stopVisualizer();
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
    startVisualizer();

    const radio = radios[currentRadio];
    updateMediaSession(
      `${radio.name} FM`,
      "Venevo Música",
      radio.logoCarro
    );

    loadNowPlaying();

  } catch (error) {
    isPlaying = true;
    playBtn.innerHTML = "❚❚";
    setLiveStatus("connecting", "CARGANDO");
    startVisualizer();

    radioPlayer.play().catch(() => {
      isPlaying = false;
      playBtn.innerHTML = "▶";
      setLiveStatus("error", "SIN SEÑAL");
      stopVisualizer();
    });
  }
}

function pauseRadio() {
  radioPlayer.pause();
  isPlaying = false;
  playBtn.innerHTML = "▶";
  setLiveStatus("paused", "PAUSADO");
  stopVisualizer();
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

    if (streamingRadioModeBtn) streamingRadioModeBtn.classList.add("active-mode");
    if (streamingStreamingModeBtn) streamingStreamingModeBtn.classList.remove("active-mode");

    streamingModeBox.classList.add("hidden");
    radioModeBox.classList.remove("hidden");
  }

  if (mode === "streaming") {
    pauseRadio();

    radioModeBtn.classList.remove("active-mode");
    streamingModeBtn.classList.add("active-mode");

    if (streamingRadioModeBtn) streamingRadioModeBtn.classList.remove("active-mode");
    if (streamingStreamingModeBtn) streamingStreamingModeBtn.classList.add("active-mode");

    radioModeBox.classList.add("hidden");
    streamingModeBox.classList.remove("hidden");

    updateStreamingBox();
  }
}

radioModeBtn.addEventListener("click", () => setMode("radio"));
streamingModeBtn.addEventListener("click", () => setMode("streaming"));

if (streamingRadioModeBtn) {
  streamingRadioModeBtn.addEventListener("click", () => setMode("radio"));
}

if (streamingStreamingModeBtn) {
  streamingStreamingModeBtn.addEventListener("click", () => setMode("streaming"));
}

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
      <div class="news-card liquid-card">
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
    item.className = "favorite-item liquid-card";
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

function cleanNowAirText(value) {
  if (!value) return "";

  return String(value)
    .replace(/^(now|nov)\s*on\s*air\s*[:\-–—]?\s*/i, "")
    .replace(/^on\s*air\s*[:\-–—]?\s*/i, "")
    .replace(/^en\s*vivo\s*[:\-–—]?\s*/i, "")
    .replace(/^live\s*[:\-–—]?\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanBadText(value) {
  if (!value) return "";

  const text = cleanNowAirText(value);

  const badValues = [
    "hi-fi",
    "hifi",
    "hi fi",
    "hi-fi internet stream",
    "hifi internet stream",
    "internet stream",
    "venevo música",
    "venevo musica",
    "radio",
    "online radio",
    "now on air",
    "nov on air"
  ];

  if (badValues.includes(text.toLowerCase())) {
    return "";
  }

  return text;
}

function isGenericSong(song) {
  if (!song) return true;

  const artist = cleanBadText(song.artist || "");
  const title = cleanBadText(song.title || "");
  const text = cleanBadText(song.text || "");

  if (!artist && !title && !text) return true;

  const rawArtist = String(song.artist || "").toLowerCase().trim();
  const rawTitle = String(song.title || "").toLowerCase().trim();
  const rawText = String(song.text || "").toLowerCase().trim();

  const genericValues = [
    "hi-fi",
    "hifi",
    "hi fi",
    "internet stream",
    "hi-fi internet stream",
    "hifi internet stream"
  ];

  if (genericValues.includes(rawArtist)) return true;
  if (genericValues.includes(rawTitle)) return true;
  if (genericValues.includes(rawText)) return true;

  if (!artist && genericValues.includes(rawTitle)) return true;
  if (!artist && genericValues.includes(rawText)) return true;

  return false;
}

function getBestSongFromApi(data) {
  const nowSong = data?.now_playing?.song || null;

  if (nowSong && !isGenericSong(nowSong)) {
    return nowSong;
  }

  const history = Array.isArray(data?.song_history) ? data.song_history : [];

  const firstRealHistory = history.find(item => {
    const historySong = item?.song || null;
    return historySong && !isGenericSong(historySong);
  });

  if (firstRealHistory?.song) {
    return firstRealHistory.song;
  }

  return nowSong;
}

function splitArtistAndTitle(text) {
  if (!text) return { artist: "", title: "" };

  let clean = cleanNowAirText(text);

  clean = clean
    .replace(/\s+\|\s+/g, " - ")
    .replace(/\s+\/\s+/g, " - ")
    .replace(/\s+–\s+/g, " - ")
    .replace(/\s+—\s+/g, " - ");

  if (clean.includes(" - ")) {
    const parts = clean.split(" - ").map(item => item.trim()).filter(Boolean);

    if (parts.length >= 2) {
      return {
        artist: cleanBadText(parts[0]),
        title: cleanBadText(parts.slice(1).join(" - "))
      };
    }
  }

  return {
    artist: "",
    title: cleanBadText(clean)
  };
}

function normalizeSongData(song, radio) {
  const rawArtist = cleanBadText(song?.artist || "");
  const rawTitle = cleanBadText(song?.title || "");
  const rawText = cleanNowAirText(song?.text || "");

  let artist = "";
  let title = "";

  const fromText = splitArtistAndTitle(rawText);
  const fromTitle = splitArtistAndTitle(rawTitle);
  const fromArtist = splitArtistAndTitle(rawArtist);

  if (fromText.artist && fromText.title) {
    artist = fromText.artist;
    title = fromText.title;
  } else if (rawArtist && rawTitle) {
    artist = rawArtist;
    title = rawTitle;
  } else if (fromTitle.artist && fromTitle.title) {
    artist = fromTitle.artist;
    title = fromTitle.title;
  } else if (fromArtist.artist && fromArtist.title) {
    artist = fromArtist.artist;
    title = fromArtist.title;
  } else {
    artist = rawArtist || fromText.artist || fromTitle.artist || "";
    title = rawTitle || fromText.title || fromTitle.title || cleanBadText(rawText) || "";
  }

  artist = cleanBadText(artist);
  title = cleanBadText(title);

  if (!artist && !title) {
    artist = `${radio.name} FM`;
    title = "Transmitiendo en vivo";
  }

  if (!artist && title) {
    artist = `${radio.name} FM`;
  }

  if (!title) {
    title = "Transmitiendo en vivo";
  }

  return { artist, title };
}

function setMarquee(box, textElement, text) {
  if (!box || !textElement) return;

  textElement.textContent = text || "";
  box.classList.remove("marquee");
  box.style.removeProperty("--marquee-distance");

  requestAnimationFrame(() => {
    const overflow = textElement.scrollWidth - box.clientWidth;

    if (overflow > 12) {
      box.style.setProperty("--marquee-distance", `${overflow + 32}px`);
      box.classList.add("marquee");
    }
  });
}

function getArtworkType(url) {
  if (!url) return "image/png";

  const cleanUrl = url.toLowerCase().split("?")[0];

  if (cleanUrl.endsWith(".jpg") || cleanUrl.endsWith(".jpeg")) {
    return "image/jpeg";
  }

  if (cleanUrl.endsWith(".webp")) {
    return "image/webp";
  }

  if (cleanUrl.endsWith(".png")) {
    return "image/png";
  }

  return "image/png";
}

function getBestLogoCarro(songArt, radio) {
  if (songArt && !songArt.includes("album_art.1772211647.png")) {
    return songArt;
  }

  if (radio && radio.logoCarro) {
    return radio.logoCarro;
  }

  return "logovenevocarro.png";
}

function setSongCover(artUrl) {
  if (!nowCover || !songCoverMain) return;

  if (!artUrl) {
    currentCoverUrl = "";
    nowCover.removeAttribute("src");
    songCoverMain.classList.remove("has-cover");
    return;
  }

  if (currentCoverUrl === artUrl && songCoverMain.classList.contains("has-cover")) {
    return;
  }

  const tempImage = new Image();

  tempImage.onload = function () {
    currentCoverUrl = artUrl;
    nowCover.src = artUrl;
    songCoverMain.classList.add("has-cover");
  };

  tempImage.onerror = function () {
    currentCoverUrl = "";
    nowCover.removeAttribute("src");
    songCoverMain.classList.remove("has-cover");
  };

  tempImage.src = artUrl;
}

function updateMediaSession(title, artist, logoCarroUrl) {
  if (!("mediaSession" in navigator)) {
    return;
  }

  const radio = radios[currentRadio];

  const finalTitle =
    title && title.trim()
      ? title.trim()
      : `${radio.name} FM`;

  const finalArtist =
    artist && artist.trim()
      ? artist.trim()
      : "Venevo Música";

  const finalLogoCarro =
    logoCarroUrl || radio.logoCarro || "logovenevocarro.png";

  try {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: finalTitle,
      artist: finalArtist,
      album: "Venevo Música",
      artwork: [
        {
          src: finalLogoCarro,
          sizes: "96x96",
          type: getArtworkType(finalLogoCarro)
        },
        {
          src: finalLogoCarro,
          sizes: "128x128",
          type: getArtworkType(finalLogoCarro)
        },
        {
          src: finalLogoCarro,
          sizes: "192x192",
          type: getArtworkType(finalLogoCarro)
        },
        {
          src: finalLogoCarro,
          sizes: "256x256",
          type: getArtworkType(finalLogoCarro)
        },
        {
          src: finalLogoCarro,
          sizes: "512x512",
          type: getArtworkType(finalLogoCarro)
        }
      ]
    });

    navigator.mediaSession.setActionHandler("play", async () => {
      await playRadio();
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      pauseRadio();
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      changeRadio(-1);
    });

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      changeRadio(1);
    });

  } catch (error) {
    console.log("Media Session no disponible completamente.");
  }
}

async function loadNowPlaying() {
  const radio = radios[currentRadio];

  if (!nowArtistMain || !nowTitle || !nowCover || !songCoverMain) return;

  if (!radio.metadataApi) {
    setMarquee(nowArtistBox, nowArtistMain, `${radio.name} FM`);
    setMarquee(nowTitleBox, nowTitle, "Transmitiendo en vivo");
    setSongCover(radio.logoCarro);
    updateSongProgress(0, 0);
    updateMediaSession(`${radio.name} FM`, "Venevo Música", radio.logoCarro);
    return;
  }

  try {
    const response = await fetch(`${radio.metadataApi}?t=${Date.now()}`, {
      cache: "no-store"
    });

    const data = await response.json();

    const song = getBestSongFromApi(data);
    const normalized = normalizeSongData(song, radio);

    const rawArt =
      song?.art ||
      song?.album_art ||
      song?.cover ||
      "";

    const logoCarro = getBestLogoCarro(rawArt, radio);

    const elapsed = Number(data?.now_playing?.elapsed || 0);
    const duration = Number(data?.now_playing?.duration || 0);

    setMarquee(nowArtistBox, nowArtistMain, normalized.artist);
    setMarquee(nowTitleBox, nowTitle, normalized.title);

    updateSongProgress(elapsed, duration);
    setSongCover(logoCarro);

    updateMediaSession(
      normalized.title,
      normalized.artist,
      logoCarro
    );

  } catch (error) {
    setMarquee(nowArtistBox, nowArtistMain, `${radio.name} FM`);
    setMarquee(nowTitleBox, nowTitle, "Transmitiendo en vivo");
    updateSongProgress(0, 0);
    setSongCover(radio.logoCarro);

    updateMediaSession(
      `${radio.name} FM`,
      "Venevo Música",
      radio.logoCarro
    );
  }
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";

  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, "0");

  return `${min}:${sec}`;
}

function updateSongProgress(elapsed, duration) {
  if (!songProgressFill || !songElapsed || !songDuration) return;

  if (!duration || duration <= 0) {
    songProgressFill.style.width = "100%";
    songElapsed.textContent = "EN VIVO";
    songDuration.textContent = "LIVE";
    return;
  }

  const percent = Math.min((elapsed / duration) * 100, 100);

  songProgressFill.style.width = `${percent}%`;
  songElapsed.textContent = formatTime(elapsed);
  songDuration.textContent = formatTime(duration);
}

function startNowPlayingUpdater() {
  if (nowPlayingInterval) {
    clearInterval(nowPlayingInterval);
  }

  loadNowPlaying();

  nowPlayingInterval = setInterval(() => {
    loadNowPlaying();
  }, 10000);
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

function setBarsIdle() {
  audioBars.forEach((bar, index) => {
    const base = index % 2 === 0 ? 8 : 11;
    bar.style.height = `${base}px`;
  });

  if (audioBarsContainer) {
    audioBarsContainer.classList.remove("playing");
  }
}

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
    analyser.smoothingTimeConstant = 0.72;

    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);

    analyserReady = true;
  } catch (error) {
    analyserReady = false;
  }
}

function startVisualizer() {
  stopVisualizer(false);

  if (audioBarsContainer) {
    audioBarsContainer.classList.add("playing");
  }

  if (analyserReady && analyser) {
    animateRealVisualizer();
  } else {
    startFakeVisualizer();
  }
}

function stopVisualizer(reset = true) {
  if (realVisualizerFrame) {
    cancelAnimationFrame(realVisualizerFrame);
    realVisualizerFrame = null;
  }

  if (fakeVisualizerInterval) {
    clearInterval(fakeVisualizerInterval);
    fakeVisualizerInterval = null;
  }

  if (reset) {
    setBarsIdle();
  }
}

function animateRealVisualizer() {
  if (!analyser || !isPlaying) {
    setBarsIdle();
    return;
  }

  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function draw() {
    if (!isPlaying) {
      setBarsIdle();
      return;
    }

    analyser.getByteFrequencyData(dataArray);

    audioBars.forEach((bar, index) => {
      const value = dataArray[index * 4] || 8;
      const height = Math.max(8, Math.min(34, value / 3.8));
      bar.style.height = `${height}px`;
    });

    realVisualizerFrame = requestAnimationFrame(draw);
  }

  draw();
}

function startFakeVisualizer() {
  if (fakeVisualizerInterval) return;

  fakeVisualizerInterval = setInterval(() => {
    if (!isPlaying) {
      setBarsIdle();
      return;
    }

    audioBars.forEach((bar, index) => {
      const wave = Math.sin(Date.now() / 150 + index * 0.75) * 10;
      const random = Math.random() * 17;
      const height = Math.max(8, Math.min(34, 14 + wave + random));
      bar.style.height = `${height}px`;
    });
  }, 90);
}

/* INIT */

setupVolume();
setBarsIdle();
updateRadioPreviews();

loadStreamingLinks().then(() => {
  loadRadio(currentRadio);
  renderFavorites();
});
