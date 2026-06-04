const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7LOdADewvPyVut9oXOtitMVocJ4sZ9JxnY8W78HAq1-DKNYryQboyfPYiS6DMxhucFA/exec";

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
    dialVideo: "diallafan.mp4",
    streaming: ""
  },
  {
    id: "clip",
    name: "CLIP",
    number: 80.5,
    subtitle: "MÚSICA · HITS",
    theme: "clip-theme",
    stream: "https://radio.megahostec.com/listen/radio_business_edmo/stream",
    metadataApi: "https://radio.megahostec.com/api/nowplaying/radio_business_edmo",
    logoVideo: "introcliplogo.mp4",
    logoCarro: "logoclipcarro.png",
    dialVideo: "dialclip.mp4",
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
    dialVideo: "dialoye.mp4",
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
    dialVideo: "dialpox.mp4",
    streaming: ""
  }
];

let currentRadio = 0;
let isPlaying = false;
let currentNumber = 90.5;
let startX = 0;
let startY = 0;
let listeners = 2800;

let dialTouchStartX = 0;
let dialTouchStartY = 0;
let dialTouchMoved = false;

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
const liveUsersCount = document.getElementById("liveUsersCount");
const listenTime = document.getElementById("listenTime");

const dialNumber = document.getElementById("dialNumber");
const dialRadioName = document.getElementById("dialRadioName");
const radioNameTop = document.getElementById("radioNameTop");
const dialSubtitle = document.getElementById("dialSubtitle");
const dialWrapper = document.getElementById("dialWrapper");
const dialArea = document.getElementById("dialArea");
const dialVideo = document.getElementById("dialVideo");

/* CARRUSEL 3D */
const radioCardPrev = document.getElementById("radioCardPrev");
const radioCardCurrent = document.getElementById("radioCardCurrent");
const radioCardNext = document.getElementById("radioCardNext");

const prevCardNumber = document.getElementById("prevCardNumber");
const prevCardName = document.getElementById("prevCardName");
const prevCardSubtitle = document.getElementById("prevCardSubtitle");

const nextCardNumber = document.getElementById("nextCardNumber");
const nextCardName = document.getElementById("nextCardName");
const nextCardSubtitle = document.getElementById("nextCardSubtitle");

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

const commentsBtn = document.getElementById("commentsBtn");

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

/* FRECUENCIAS DIGITALES */
const drawerFrequencyBtn = document.getElementById("drawerFrequencyBtn");
const frequencyModal = document.getElementById("frequencyModal");
const frequencyModalOverlay = document.getElementById("frequencyModalOverlay");
const closeFrequencyModalBtn = document.getElementById("closeFrequencyModalBtn");

const countrySearchInput = document.getElementById("countrySearchInput");
const countryList = document.getElementById("countryList");

const provinceStep = document.getElementById("provinceStep");
const provinceSearchInput = document.getElementById("provinceSearchInput");
const provinceList = document.getElementById("provinceList");

const frequencyStep = document.getElementById("frequencyStep");
const frequencySearchInput = document.getElementById("frequencySearchInput");
const frequencyResults = document.getElementById("frequencyResults");

const frequencyBuyBox = document.getElementById("frequencyBuyBox");
const selectedFrequencyTitle = document.getElementById("selectedFrequencyTitle");
const selectedFrequencyLocation = document.getElementById("selectedFrequencyLocation");
const selectedFrequencyPrice = document.getElementById("selectedFrequencyPrice");

const requestRadioName = document.getElementById("requestRadioName");
const requestOwnerName = document.getElementById("requestOwnerName");
const requestWhatsapp = document.getElementById("requestWhatsapp");
const requestEmail = document.getElementById("requestEmail");
const requestStream = document.getElementById("requestStream");
const requestApiNowPlaying = document.getElementById("requestApiNowPlaying");
const requestObservation = document.getElementById("requestObservation");
const submitFrequencyRequestBtn = document.getElementById("submitFrequencyRequestBtn");
const frequencyFormMessage = document.getElementById("frequencyFormMessage");

let venevoFrequencies = [];
let selectedCountry = "";
let selectedProvince = "";
let selectedFrequency = null;

const countryFlags = {
  // Sudamérica
  "Argentina": "🇦🇷",
  "Bolivia": "🇧🇴",
  "Brasil": "🇧🇷",
  "Chile": "🇨🇱",
  "Colombia": "🇨🇴",
  "Ecuador": "🇪🇨",
  "Guyana": "🇬🇾",
  "Paraguay": "🇵🇾",
  "Perú": "🇵🇪",
  "Peru": "🇵🇪",
  "Surinam": "🇸🇷",
  "Uruguay": "🇺🇾",
  "Venezuela": "🇻🇪",

  // Norteamérica
  "Canadá": "🇨🇦",
  "Canada": "🇨🇦",
  "Estados Unidos": "🇺🇸",
  "México": "🇲🇽",
  "Mexico": "🇲🇽",

  // Centroamérica
  "Belice": "🇧🇿",
  "Costa Rica": "🇨🇷",
  "El Salvador": "🇸🇻",
  "Guatemala": "🇬🇹",
  "Honduras": "🇭🇳",
  "Nicaragua": "🇳🇮",
  "Panamá": "🇵🇦",
  "Panama": "🇵🇦",

  // Caribe
  "Cuba": "🇨🇺",
  "República Dominicana": "🇩🇴",
  "Republica Dominicana": "🇩🇴",
  "Puerto Rico": "🇵🇷",
  "Haití": "🇭🇹",
  "Haiti": "🇭🇹",
  "Jamaica": "🇯🇲",

  // Europa
  "España": "🇪🇸",
  "Portugal": "🇵🇹",
  "Francia": "🇫🇷",
  "Italia": "🇮🇹",
  "Alemania": "🇩🇪",
  "Reino Unido": "🇬🇧",
  "Irlanda": "🇮🇪",
  "Países Bajos": "🇳🇱",
  "Paises Bajos": "🇳🇱",
  "Bélgica": "🇧🇪",
  "Belgica": "🇧🇪",
  "Suiza": "🇨🇭",
  "Austria": "🇦🇹",
  "Suecia": "🇸🇪",
  "Noruega": "🇳🇴",
  "Dinamarca": "🇩🇰",
  "Finlandia": "🇫🇮",
  "Polonia": "🇵🇱",
  "Grecia": "🇬🇷",
  "Rumania": "🇷🇴",
  "Ucrania": "🇺🇦",
  "Rusia": "🇷🇺"
};

const availableCountriesCatalog = [
  // Sudamérica
  "Argentina",
  "Bolivia",
  "Brasil",
  "Chile",
  "Colombia",
  "Ecuador",
  "Guyana",
  "Paraguay",
  "Perú",
  "Surinam",
  "Uruguay",
  "Venezuela",

  // Norteamérica
  "Canadá",
  "Estados Unidos",
  "México",

  // Centroamérica
  "Belice",
  "Costa Rica",
  "El Salvador",
  "Guatemala",
  "Honduras",
  "Nicaragua",
  "Panamá",

  // Caribe
  "Cuba",
  "República Dominicana",
  "Puerto Rico",
  "Haití",
  "Jamaica",

  // Europa
  "España",
  "Portugal",
  "Francia",
  "Italia",
  "Alemania",
  "Reino Unido",
  "Irlanda",
  "Países Bajos",
  "Bélgica",
  "Suiza",
  "Austria",
  "Suecia",
  "Noruega",
  "Dinamarca",
  "Finlandia",
  "Polonia",
  "Grecia",
  "Rumania",
  "Ucrania",
  "Rusia"
];

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
    const response = await fetch(`${APPS_SCRIPT_URL}?t=${Date.now()}`, {
      cache: "no-store"
    });

    const data = await response.json();

    if (data.success && data.radios) {
      radios.forEach(radio => {
        if (data.radios[radio.id]) {
          radio.streaming = data.radios[radio.id].streamVideo || "";
        }
      });
    }

    if (data.success && Array.isArray(data.frecuencias)) {
      venevoFrequencies = data.frecuencias
        .map(item => normalizeFrequencyItem(item))
        .filter(item => item.id && item.pais && item.provincia && item.frecuencia);

      agregarRadiosCompradasDesdeFrecuencias();
      renderCountries();
    }
  } catch (error) {
    console.log("No se pudo cargar Google Sheets.");
  }
}

/* MODAL OBTÉN TU FRECUENCIA */

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizeEstado(value) {
  const clean = normalizeText(value);

  if (clean === "ocupada" || clean === "ocupado") {
    return "ocupado";
  }

  return "libre";
}

function normalizeFrequencyItem(item) {
  const pais = String(item.pais || item.PAIS || "").trim();
  const provincia = String(item.provincia || item.PROVINCIA_DEPARTAMENTO || "").trim();
  const frecuencia = String(item.frecuencia || item.FRECUENCIA || "").trim();

  return {
    id: String(item.id || item.ID || "").trim(),
    pais,
    bandera: countryFlags[pais] || "🌐",
    provincia,
    frecuencia,
    banda: String(item.banda || item.BANDA || "FM").trim() || "FM",
    estado: normalizeEstado(item.estado || item.ESTADO || "libre"),
    precio: String(item.precio || item.PRECIO || "").trim(),
    radioReferencia: String(item.radioReferencia || item.RADIO_REFERENCIA || "").trim(),
    tipoReferencia: String(item.tipoReferencia || item.TIPO_REFERENCIA || "").trim(),
    areaServidaReferencia: String(item.areaServidaReferencia || item.AREA_SERVIDA_REFERENCIA || "").trim(),
    whatsapp: String(item.whatsapp || item.WHATSAPP || "").trim(),
    observacion: String(item.observacion || item.OBSERVACION || "").trim(),
    fuente: String(item.fuente || item.FUENTE || "").trim(),
    stream: String(item.stream || item.STREAM || "").trim(),
    apiNowPlaying: String(item.apiNowPlaying || item.API_NOWPLAYING || "").trim(),
    activo: String(item.activo || item.ACTIVO || "").trim().toLowerCase()
  };
}

/* AGREGA Y QUITA RADIOS COMPRADAS DEL CARRUSEL */

function agregarRadiosCompradasDesdeFrecuencias() {
  if (!Array.isArray(venevoFrequencies)) return;

  /*
    REGLA SIMPLE:
    - ESTADO = ocupado + STREAM lleno -> aparece en el carrusel
    - ESTADO = libre -> desaparece completamente del carrusel
  */

  const idsRadiosOcupadas = new Set();

  const radiosCompradasActivas = venevoFrequencies
    .filter(item => {
      const estado = String(item.estado || "").trim().toLowerCase();
      const stream = String(item.stream || "").trim();

      const debeAparecer =
        estado === "ocupado" &&
        stream !== "";

      if (debeAparecer) {
        idsRadiosOcupadas.add(item.id);
      }

      return debeAparecer;
    })
    .map(item => {
      const frecuenciaNumero = Number(String(item.frecuencia).replace(",", "."));

      return {
        id: item.id,
        name: item.radioReferencia || `Radio ${item.frecuencia}`,
        number: isNaN(frecuenciaNumero) ? 0 : frecuenciaNumero,
        subtitle: `${String(item.pais || "").toUpperCase()} · ${String(item.provincia || "").toUpperCase()}`,
        theme: "custom-radio-theme",
        stream: item.stream,
        metadataApi: item.apiNowPlaying || "",
        logoVideo: "venevologovideo.mp4",
        logoCarro: "logovenevocarro.png",
        dialVideo: "",
        streaming: "",
        isPurchasedRadio: true
      };
    });

  /*
    Eliminar del carrusel las radios compradas que ya no estén ocupadas.
    Si cambias en Google Sheets de ocupado a libre, desaparece.
  */
  for (let i = radios.length - 1; i >= 0; i--) {
    const radio = radios[i];

    if (radio.isPurchasedRadio && !idsRadiosOcupadas.has(radio.id)) {
      const estabaSonando = i === currentRadio;

      radios.splice(i, 1);

      if (currentRadio >= radios.length) {
        currentRadio = 0;
      }

      if (estabaSonando) {
        pauseRadio();
        loadRadio(currentRadio);
      }
    }
  }

  /*
    Agregar o actualizar las radios compradas que sí estén ocupadas.
  */
  radiosCompradasActivas.forEach(radioNueva => {
    const indexExistente = radios.findIndex(radio => radio.id === radioNueva.id);

    if (indexExistente === -1) {
      radios.push(radioNueva);
    } else {
      radios[indexExistente] = {
        ...radios[indexExistente],
        ...radioNueva
      };
    }
  });

  if (currentRadio >= radios.length) {
    currentRadio = 0;
  }

  updateRadioCarousel();
}

function uniqueByName(items, key) {
  const map = new Map();

  items.forEach(item => {
    const value = String(item[key] || "").trim();
    if (!value) return;

    const normalized = normalizeText(value);

    if (!map.has(normalized)) {
      map.set(normalized, value);
    }
  });

  return Array.from(map.values()).sort((a, b) => a.localeCompare(b, "es"));
}

function openFrequencyModal() {
  if (!frequencyModal) return;

  frequencyModal.classList.remove("hidden");
  frequencyModal.setAttribute("aria-hidden", "false");

  closeDrawer();
  renderCountries();

  setTimeout(() => {
    if (countrySearchInput) countrySearchInput.focus();
  }, 150);
}

function closeFrequencyModal() {
  if (!frequencyModal) return;

  frequencyModal.classList.add("hidden");
  frequencyModal.setAttribute("aria-hidden", "true");
}

function resetFrequencyFlow(level = "country") {
  if (level === "country") {
    selectedCountry = "";
    selectedProvince = "";
    selectedFrequency = null;

    if (provinceSearchInput) {
      provinceSearchInput.value = "";
      provinceSearchInput.disabled = true;
    }

    if (frequencySearchInput) {
      frequencySearchInput.value = "";
      frequencySearchInput.disabled = true;
    }

    if (provinceStep) provinceStep.classList.add("frequency-step-disabled");
    if (frequencyStep) frequencyStep.classList.add("frequency-step-disabled");
    if (provinceList) provinceList.innerHTML = "";
    if (frequencyResults) frequencyResults.innerHTML = "";
    if (frequencyBuyBox) frequencyBuyBox.classList.add("hidden");
  }

  if (level === "province") {
    selectedProvince = "";
    selectedFrequency = null;

    if (frequencySearchInput) {
      frequencySearchInput.value = "";
      frequencySearchInput.disabled = true;
    }

    if (frequencyStep) frequencyStep.classList.add("frequency-step-disabled");
    if (frequencyResults) frequencyResults.innerHTML = "";
    if (frequencyBuyBox) frequencyBuyBox.classList.add("hidden");
  }

  if (level === "frequency") {
    selectedFrequency = null;

    if (frequencyBuyBox) frequencyBuyBox.classList.add("hidden");
  }
}

function renderCountries() {
  if (!countryList) return;

  const search = normalizeText(countrySearchInput ? countrySearchInput.value : "");

  /*
    Países activos = países que realmente existen en Google Sheets.
    Si mañana agregas Argentina, México o España en la hoja Frecuencias,
    automáticamente dejarán de salir como "Próximamente".
  */
  const activeCountries = uniqueByName(venevoFrequencies, "pais");

  /*
    Lista visible = catálogo general + cualquier país nuevo que venga desde Google Sheets.
  */
  const mergedCountries = Array.from(
    new Set([
      ...availableCountriesCatalog,
      ...activeCountries
    ])
  );

  const countries = mergedCountries
    .filter(country => normalizeText(country).includes(search));

  countryList.innerHTML = "";

  if (!countries.length) {
    countryList.innerHTML = `<p class="frequency-empty">No hay países con esa búsqueda.</p>`;
    return;
  }

  countries.forEach(country => {
    const isActive = activeCountries.some(activeCountry =>
      normalizeText(activeCountry) === normalizeText(country)
    );

    const button = document.createElement("button");
    button.type = "button";
    button.className = "frequency-option-btn";
    button.classList.toggle("selected", selectedCountry === country);
    button.classList.toggle("frequency-option-disabled", !isActive);
    button.disabled = false;

    button.innerHTML = `
      <span class="frequency-flag">${countryFlags[country] || "🌐"}</span>
      <div class="frequency-country-text">
        <strong>${country}</strong>
        <small>${isActive ? "Disponible" : "Próximamente"}</small>
      </div>
    `;

    button.addEventListener("click", () => {
      if (!isActive) {
        showFrequencyFormMessage("Este país estará disponible próximamente.", "error");
        return;
      }

      selectedCountry = country;

      if (countrySearchInput) {
        countrySearchInput.value = country;
      }

      if (provinceStep) {
        provinceStep.classList.remove("frequency-step-disabled");
      }

      if (provinceSearchInput) {
        provinceSearchInput.disabled = false;
        provinceSearchInput.value = "";
        provinceSearchInput.focus();
      }

      resetFrequencyFlow("province");
      renderCountries();
      renderProvinces();
    });

    countryList.appendChild(button);
  });
}

function renderProvinces() {
  if (!provinceList) return;

  const search = normalizeText(provinceSearchInput ? provinceSearchInput.value : "");

  const provinces = uniqueByName(
    venevoFrequencies.filter(item => item.pais === selectedCountry),
    "provincia"
  ).filter(province => normalizeText(province).includes(search));

  provinceList.innerHTML = "";

  if (!selectedCountry) {
    provinceList.innerHTML = `<p class="frequency-empty">Primero elige un país.</p>`;
    return;
  }

  if (!provinces.length) {
    provinceList.innerHTML = `<p class="frequency-empty">No hay provincias disponibles.</p>`;
    return;
  }

  provinces.forEach(province => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "frequency-option-btn";
    button.classList.toggle("selected", selectedProvince === province);

    const total = venevoFrequencies.filter(item =>
      item.pais === selectedCountry &&
      item.provincia === province
    ).length;

    button.innerHTML = `
      <strong>${province}</strong>
      <small>${total} frecuencias FM</small>
    `;

    button.addEventListener("click", () => {
      selectedProvince = province;

      if (provinceSearchInput) {
        provinceSearchInput.value = province;
      }

      if (frequencyStep) {
        frequencyStep.classList.remove("frequency-step-disabled");
      }

      if (frequencySearchInput) {
        frequencySearchInput.disabled = false;
        frequencySearchInput.value = "";
        frequencySearchInput.focus();
      }

      resetFrequencyFlow("frequency");
      renderProvinces();
      renderFrequencyResults();
    });

    provinceList.appendChild(button);
  });
}

function renderFrequencyResults() {
  if (!frequencyResults) return;

  const search = normalizeText(frequencySearchInput ? frequencySearchInput.value : "");

  const items = venevoFrequencies
    .filter(item =>
      item.pais === selectedCountry &&
      item.provincia === selectedProvince
    )
    .filter(item => {
      if (!search) return true;

      return (
        normalizeText(item.frecuencia).includes(search) ||
        normalizeText(item.radioReferencia).includes(search)
      );
    })
    .sort((a, b) => Number(a.frecuencia) - Number(b.frecuencia));

  frequencyResults.innerHTML = "";

  if (!selectedCountry || !selectedProvince) {
    frequencyResults.innerHTML = `<p class="frequency-empty">Primero elige país y provincia.</p>`;
    return;
  }

  if (!items.length) {
    frequencyResults.innerHTML = `<p class="frequency-empty">No hay frecuencias con esa búsqueda.</p>`;
    return;
  }

  items.forEach(item => {
    const isTaken = item.estado === "ocupado";

    const card = document.createElement("button");
    card.type = "button";
    card.className = `frequency-result-card ${isTaken ? "taken" : "available"}`;

    const price = item.precio ? `$${item.precio}` : "Consultar";

    card.innerHTML = `
      <div>
        <span class="frequency-number">${item.frecuencia} FD</span>
        <small>${item.banda || "FM"} · ${item.radioReferencia || "Frecuencia digital Venevo"}</small>
      </div>
      <div class="frequency-status">
        <strong>${isTaken ? "Ocupado" : "Libre"}</strong>
        <small>${isTaken ? "No disponible" : price}</small>
      </div>
    `;

    card.addEventListener("click", () => {
      if (isTaken) {
        showFrequencyFormMessage("Esta frecuencia ya está ocupada en Venevo.", "error");
        return;
      }

      selectFrequency(item);
    });

    frequencyResults.appendChild(card);
  });
}

function selectFrequency(item) {
  selectedFrequency = item;

  if (selectedFrequencyTitle) {
    selectedFrequencyTitle.textContent = `${item.frecuencia} FD`;
  }

  if (selectedFrequencyLocation) {
    selectedFrequencyLocation.textContent = `${countryFlags[item.pais] || ""} ${item.pais} / ${item.provincia}`;
  }

  if (selectedFrequencyPrice) {
    selectedFrequencyPrice.textContent = item.precio ? `$${item.precio}` : "Precio a confirmar";
  }

  if (frequencyBuyBox) {
    frequencyBuyBox.classList.remove("hidden");
    frequencyBuyBox.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  showFrequencyFormMessage("", "");
}

function clearFrequencyForm() {
  if (requestRadioName) requestRadioName.value = "";
  if (requestOwnerName) requestOwnerName.value = "";
  if (requestWhatsapp) requestWhatsapp.value = "";
  if (requestEmail) requestEmail.value = "";
  if (requestStream) requestStream.value = "";
  if (requestApiNowPlaying) requestApiNowPlaying.value = "";
  if (requestObservation) requestObservation.value = "";
}

function showFrequencyFormMessage(message, type) {
  if (!frequencyFormMessage) return;

  frequencyFormMessage.textContent = message || "";
  frequencyFormMessage.className = `frequency-form-message ${type || ""}`;
}

async function submitFrequencyRequest() {
  if (!selectedFrequency) {
    showFrequencyFormMessage("Primero selecciona una frecuencia libre.", "error");
    return;
  }

  const radioName = requestRadioName ? requestRadioName.value.trim() : "";
  const ownerName = requestOwnerName ? requestOwnerName.value.trim() : "";
  const whatsapp = requestWhatsapp ? requestWhatsapp.value.trim() : "";
  const email = requestEmail ? requestEmail.value.trim() : "";
  const stream = requestStream ? requestStream.value.trim() : "";
  const apiNowPlaying = requestApiNowPlaying ? requestApiNowPlaying.value.trim() : "";
  const observation = requestObservation ? requestObservation.value.trim() : "";

  if (!radioName || !ownerName || !whatsapp) {
    showFrequencyFormMessage("Completa nombre de la radio, titular y WhatsApp.", "error");
    return;
  }

  const payload = {
    ID_FRECUENCIA: selectedFrequency.id,
    PAIS: selectedFrequency.pais,
    PROVINCIA_DEPARTAMENTO: selectedFrequency.provincia,
    FRECUENCIA: selectedFrequency.frecuencia,
    PRECIO: selectedFrequency.precio,
    RADIO_SOLICITADA: radioName,
    TITULAR: ownerName,
    WHATSAPP: whatsapp,
    CORREO: email,
    STREAM: stream,
    API_NOWPLAYING: apiNowPlaying,
    OBSERVACION: observation,
    ESTADO: "libre"
  };

  try {
    if (submitFrequencyRequestBtn) {
      submitFrequencyRequestBtn.disabled = true;
      submitFrequencyRequestBtn.textContent = "Enviando...";
    }

    showFrequencyFormMessage("Enviando solicitud...", "");

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "No se pudo registrar la solicitud.");
    }

    showFrequencyFormMessage("Solicitud enviada correctamente. Te contactaremos para finalizar la compra.", "success");
    clearFrequencyForm();

  } catch (error) {
    showFrequencyFormMessage("No se pudo enviar la solicitud. Intenta nuevamente.", "error");
    console.log(error);
  } finally {
    if (submitFrequencyRequestBtn) {
      submitFrequencyRequestBtn.disabled = false;
      submitFrequencyRequestBtn.textContent = "Enviar solicitud";
    }
  }
}

function setupFrequencyModal() {
  if (drawerFrequencyBtn) {
    drawerFrequencyBtn.addEventListener("click", openFrequencyModal);
  }

  if (closeFrequencyModalBtn) {
    closeFrequencyModalBtn.addEventListener("click", closeFrequencyModal);
  }

  if (frequencyModalOverlay) {
    frequencyModalOverlay.addEventListener("click", closeFrequencyModal);
  }

  if (countrySearchInput) {
    countrySearchInput.addEventListener("input", () => {
      resetFrequencyFlow("country");
      renderCountries();
    });
  }

  if (provinceSearchInput) {
    provinceSearchInput.addEventListener("input", renderProvinces);
  }

  if (frequencySearchInput) {
    frequencySearchInput.addEventListener("input", renderFrequencyResults);
  }

  if (submitFrequencyRequestBtn) {
    submitFrequencyRequestBtn.addEventListener("click", submitFrequencyRequest);
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && frequencyModal && !frequencyModal.classList.contains("hidden")) {
      closeFrequencyModal();
    }
  });
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

/* MINI LIVE USERS + LISTEN TIME */

function formatUsersToK(value) {
  if (!value || isNaN(value)) return "2.8K";

  const kValue = value / 1000;
  return `${kValue.toFixed(1)}K`;
}

function updateLiveUsers() {
  const variation = Math.floor(Math.random() * 180) + 35;
  const up = Math.random() > 0.48;

  listeners = up ? listeners + variation : listeners - variation;

  if (listeners < 1500) listeners = 1650 + Math.floor(Math.random() * 280);
  if (listeners > 4000) listeners = 3650 - Math.floor(Math.random() * 250);

  if (liveUsersCount) {
    liveUsersCount.textContent = formatUsersToK(listeners);
  }
}

function setupListenTime() {
  const storageKey = "venevoListenStartTime";
  let startTime = localStorage.getItem(storageKey);

  if (!startTime) {
    startTime = String(Date.now());
    localStorage.setItem(storageKey, startTime);
  }

  function updateListenTime() {
    const savedStart = Number(localStorage.getItem(storageKey) || Date.now());
    const elapsedSeconds = Math.floor((Date.now() - savedStart) / 1000);

    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    const formatted =
      `${String(hours).padStart(2, "0")}:` +
      `${String(minutes).padStart(2, "0")}:` +
      `${String(seconds).padStart(2, "0")}`;

    if (listenTime) {
      listenTime.textContent = formatted;
    }
  }

  updateListenTime();
  setInterval(updateListenTime, 1000);
}

/* DIAL */

function animateNumber(from, to) {
  const duration = 650;
  const start = performance.now();

  function step(time) {
    const progress = Math.min((time - start) / duration, 1);
    const value = from + (to - from) * progress;

    if (dialNumber) {
      dialNumber.textContent = value.toFixed(1);
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (dialNumber) {
        dialNumber.textContent = to.toFixed(1);
      }

      currentNumber = to;
    }
  }

  requestAnimationFrame(step);
}

function spinDial() {
  if (!dialWrapper) return;

  dialWrapper.classList.remove("spin");
  void dialWrapper.offsetWidth;
  dialWrapper.classList.add("spin");
}

function updateTopIdentity(radio) {
  if (!radioNameTop) return;

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

function updateRadioCarousel() {
  const prevIndex = (currentRadio - 1 + radios.length) % radios.length;
  const nextIndex = (currentRadio + 1) % radios.length;

  const prev = radios[prevIndex];
  const next = radios[nextIndex];
  const current = radios[currentRadio];

  if (prevCardNumber) {
    prevCardNumber.textContent = formatPreviewNumber(prev.number);
  }

  if (prevCardName) {
    prevCardName.textContent = prev.name;
  }

  if (prevCardSubtitle) {
    prevCardSubtitle.textContent = prev.subtitle;
  }

  if (nextCardNumber) {
    nextCardNumber.textContent = formatPreviewNumber(next.number);
  }

  if (nextCardName) {
    nextCardName.textContent = next.name;
  }

  if (nextCardSubtitle) {
    nextCardSubtitle.textContent = next.subtitle;
  }

  if (radioCardPrev) {
    radioCardPrev.dataset.radio = prev.id;
  }

  if (radioCardCurrent) {
    radioCardCurrent.dataset.radio = current.id;
  }

  if (radioCardNext) {
    radioCardNext.dataset.radio = next.id;
  }
}

/* VIDEO DENTRO DEL DIAL */

function updateDialVideo(radio) {
  if (!dialVideo || !dialWrapper) return;

  if (radio.dialVideo) {
    if (dialVideo.getAttribute("src") !== radio.dialVideo) {
      dialVideo.src = radio.dialVideo;
      dialVideo.load();
    }

    dialWrapper.classList.add("has-dial-video");

    dialVideo.play().catch(() => {
      console.log("El video del dial no pudo reproducirse automáticamente.");
    });

    return;
  }

  dialWrapper.classList.remove("has-dial-video");

  try {
    dialVideo.pause();
  } catch (error) {}

  dialVideo.removeAttribute("src");
  dialVideo.load();
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

  if (radio.theme === "custom-radio-theme") {
    document.body.style.background =
      "radial-gradient(circle at top, #1b1b1b, #090909 48%, #000)";
  } else {
    document.body.style.removeProperty("background");
  }

  spinDial();
  animateNumber(currentNumber, radio.number);

  updateTopIdentity(radio);
  updateRadioCarousel();
  updateDialVideo(radio);

  if (dialRadioName) {
    dialRadioName.textContent = `${radio.name} FM`;
  }

  if (dialSubtitle) {
    dialSubtitle.textContent = radio.subtitle;
  }

  resetSongCoverToVideo();

  if (radioLogoVideo) {
    radioLogoVideo.src = radio.logoVideo;
    radioLogoVideo.load();
  }

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

    updateDialVideo(radio);

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

async function togglePlayPause() {
  if (!isPlaying) {
    await playRadio();
  } else {
    pauseRadio();
  }
}

if (playBtn) {
  playBtn.addEventListener("click", async event => {
    event.stopPropagation();
    await togglePlayPause();
  });
}

/* PLAY / PAUSA TOCANDO TODO EL DIAL */

function setupDialPlayPause() {
  if (!dialWrapper) return;

  dialWrapper.setAttribute("role", "button");
  dialWrapper.setAttribute("tabindex", "0");
  dialWrapper.setAttribute("aria-label", "Reproducir o pausar radio");

  dialWrapper.addEventListener("touchstart", event => {
    if (!event.touches || !event.touches[0]) return;

    dialTouchMoved = false;
    dialTouchStartX = event.touches[0].clientX;
    dialTouchStartY = event.touches[0].clientY;
  }, { passive: true });

  dialWrapper.addEventListener("touchmove", event => {
    if (!event.touches || !event.touches[0]) return;

    const moveX = Math.abs(event.touches[0].clientX - dialTouchStartX);
    const moveY = Math.abs(event.touches[0].clientY - dialTouchStartY);

    if (moveX > 18 || moveY > 18) {
      dialTouchMoved = true;
    }
  }, { passive: true });

  dialWrapper.addEventListener("click", async event => {
    event.stopPropagation();

    if (dialTouchMoved) {
      dialTouchMoved = false;
      return;
    }

    await togglePlayPause();
  });

  dialWrapper.addEventListener("keydown", async event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      await togglePlayPause();
    }
  });
}

/* RADIO NAVIGATION */

if (nextRadio) {
  nextRadio.addEventListener("click", () => changeRadio(1));
}

if (prevRadio) {
  prevRadio.addEventListener("click", () => changeRadio(-1));
}

if (nextRadioBottom) {
  nextRadioBottom.addEventListener("click", () => changeRadio(1));
}

if (prevRadioBottom) {
  prevRadioBottom.addEventListener("click", () => changeRadio(-1));
}

if (dialArea) {
  dialArea.addEventListener("touchstart", e => {
    if (!e.touches || !e.touches[0]) return;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  dialArea.addEventListener("touchend", e => {
    if (!e.changedTouches || !e.changedTouches[0]) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      diffX > 0 ? changeRadio(1) : changeRadio(-1);
    }
  }, { passive: true });

  dialArea.addEventListener("mousedown", e => {
    startX = e.clientX;
    startY = e.clientY;
  });

  dialArea.addEventListener("mouseup", e => {
    const endX = e.clientX;
    const endY = e.clientY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      diffX > 0 ? changeRadio(1) : changeRadio(-1);
    }
  });
}

/* STREAMING */

function updateStreamingBox() {
  const radio = radios[currentRadio];
  const url = convertToEmbedUrl(radio.streaming);

  if (!streamingContent) return;

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
    if (streamingModeBtn) streamingModeBtn.classList.remove("active-mode");
    if (radioModeBtn) radioModeBtn.classList.add("active-mode");

    if (streamingRadioModeBtn) streamingRadioModeBtn.classList.add("active-mode");
    if (streamingStreamingModeBtn) streamingStreamingModeBtn.classList.remove("active-mode");

    if (streamingModeBox) streamingModeBox.classList.add("hidden");
    if (radioModeBox) radioModeBox.classList.remove("hidden");
  }

  if (mode === "streaming") {
    pauseRadio();

    if (radioModeBtn) radioModeBtn.classList.remove("active-mode");
    if (streamingModeBtn) streamingModeBtn.classList.add("active-mode");

    if (streamingRadioModeBtn) streamingRadioModeBtn.classList.remove("active-mode");
    if (streamingStreamingModeBtn) streamingStreamingModeBtn.classList.add("active-mode");

    if (radioModeBox) radioModeBox.classList.add("hidden");
    if (streamingModeBox) streamingModeBox.classList.remove("hidden");

    updateStreamingBox();
  }
}

if (radioModeBtn) {
  radioModeBtn.addEventListener("click", () => setMode("radio"));
}

if (streamingModeBtn) {
  streamingModeBtn.addEventListener("click", () => setMode("streaming"));
}

if (streamingRadioModeBtn) {
  streamingRadioModeBtn.addEventListener("click", () => setMode("radio"));
}

if (streamingStreamingModeBtn) {
  streamingStreamingModeBtn.addEventListener("click", () => setMode("streaming"));
}

/* COMENTARIOS - MAQUETA INICIAL */

if (commentsBtn) {
  commentsBtn.addEventListener("click", () => {
    alert("Comentarios próximamente.");
  });
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

if (menuBtn) menuBtn.addEventListener("click", openDrawer);
if (closeDrawerBtn) closeDrawerBtn.addEventListener("click", closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);

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

if (shareBtn) shareBtn.addEventListener("click", shareCurrentRadio);
if (drawerShareBtn) drawerShareBtn.addEventListener("click", shareCurrentRadio);
if (moreShareBtn) moreShareBtn.addEventListener("click", shareCurrentRadio);

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
  if (!favoriteBtn) return;

  const radio = radios[currentRadio];

  if (isFavorite(radio.id)) {
    favoriteBtn.classList.add("favorite-active");
  } else {
    favoriteBtn.classList.remove("favorite-active");
  }
}

if (favoriteBtn) {
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
}

function renderFavorites() {
  if (!favoritesList) return;

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
  if (!radioPlayer || !volumeSlider || !volumePanel || !volumeBtn) return;

  let volumeHideTimer = null;

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

  function hideVolumePanel() {
    volumePanel.classList.add("volume-fading");

    setTimeout(() => {
      volumePanel.classList.add("hidden");
      volumePanel.classList.remove("volume-fading");
    }, 250);
  }

  function showVolumePanel() {
    volumePanel.classList.remove("hidden");
    volumePanel.classList.remove("volume-fading");

    if (volumeHideTimer) {
      clearTimeout(volumeHideTimer);
    }

    volumeHideTimer = setTimeout(() => {
      hideVolumePanel();
    }, 5000);
  }

  volumeBtn.onclick = () => {
    if (volumePanel.classList.contains("hidden")) {
      showVolumePanel();
    } else {
      if (volumeHideTimer) {
        clearTimeout(volumeHideTimer);
      }

      hideVolumePanel();
    }
  };

  volumeSlider.oninput = () => {
    const volume = Number(volumeSlider.value);
    radioPlayer.volume = volume;
    showVolumePanel();
  };

  volumeSlider.addEventListener("touchstart", e => {
    e.stopPropagation();
    showVolumePanel();
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
    showVolumePanel();
  }, { passive: false });

  volumeSlider.addEventListener("mousedown", () => {
    showVolumePanel();
  });

  volumeSlider.addEventListener("mousemove", event => {
    if (event.buttons === 1) {
      showVolumePanel();
    }
  });
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

setupFrequencyModal();
setupVolume();
setupDialPlayPause();
setBarsIdle();
setupListenTime();

updateLiveUsers();
setInterval(updateLiveUsers, 4500);

updateRadioCarousel();

loadStreamingLinks().then(() => {
  loadRadio(currentRadio);
  renderFavorites();
});

setInterval(() => {
  loadStreamingLinks();
}, 30000);
