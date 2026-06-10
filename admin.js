const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7LOdADewvPyVut9oXOtitMVocJ4sZ9JxnY8W78HAq1-DKNYryQboyfPYiS6DMxhucFA/exec";

let APPS_SCRIPT_URL =
  localStorage.getItem("venevoAdminAppsScriptUrl") || DEFAULT_APPS_SCRIPT_URL;

let adminSession = JSON.parse(localStorage.getItem("venevoAdminSession") || "null");

let adminRadios = [];
let adminFrecuencias = [];
let adminSolicitudes = [];

const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");

const loginForm = document.getElementById("loginForm");
const adminUser = document.getElementById("adminUser");
const adminPassword = document.getElementById("adminPassword");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");

const adminTabs = document.querySelectorAll(".admin-tab");
const adminPanels = document.querySelectorAll(".admin-panel");

const loadRadiosBtn = document.getElementById("loadRadiosBtn");
const radiosList = document.getElementById("radiosList");

const loadFrecuenciasBtn = document.getElementById("loadFrecuenciasBtn");
const frecuenciasList = document.getElementById("frecuenciasList");
const frequencySearchAdmin = document.getElementById("frequencySearchAdmin");

const loadSolicitudesBtn = document.getElementById("loadSolicitudesBtn");
const solicitudesList = document.getElementById("solicitudesList");

const appsScriptUrlInput = document.getElementById("appsScriptUrlInput");
const saveConfigBtn = document.getElementById("saveConfigBtn");
const configMessage = document.getElementById("configMessage");

const editModal = document.getElementById("editModal");
const editModalOverlay = document.getElementById("editModalOverlay");
const closeEditModalBtn = document.getElementById("closeEditModalBtn");
const editForm = document.getElementById("editForm");
const editModalTitle = document.getElementById("editModalTitle");

const editType = document.getElementById("editType");
const editId = document.getElementById("editId");
const editRadioName = document.getElementById("editRadioName");
const editStream = document.getElementById("editStream");
const editApiNowPlaying = document.getElementById("editApiNowPlaying");
const editStreamingLive = document.getElementById("editStreamingLive");
const editColor1 = document.getElementById("editColor1");
const editColor2 = document.getElementById("editColor2");
const editEstado = document.getElementById("editEstado");
const editActivo = document.getElementById("editActivo");
const editMessage = document.getElementById("editMessage");

/* UTILIDADES */

function setMessage(element, text, type = "") {
  if (!element) return;

  element.textContent = text || "";
  element.className = `admin-message ${type || ""}`;
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getValue(item, keys, fallback = "") {
  for (const key of keys) {
    if (item && item[key] !== undefined && item[key] !== null && String(item[key]).trim() !== "") {
      return String(item[key]).trim();
    }
  }

  return fallback;
}

function isValidHexColor(value) {
  return /^#[0-9A-Fa-f]{6}$/.test(String(value || "").trim());
}

function safeColor(value, fallback) {
  const clean = String(value || "").trim();

  if (isValidHexColor(clean)) {
    return clean;
  }

  return fallback;
}

function showLoading(container, text = "Cargando información...") {
  if (!container) return;

  container.innerHTML = `
    <div class="empty-box">
      ${text}
    </div>
  `;
}

function showEmpty(container, text = "No hay información disponible.") {
  if (!container) return;

  container.innerHTML = `
    <div class="empty-box">
      ${text}
    </div>
  `;
}

async function apiGet(action, params = {}) {
  const url = new URL(APPS_SCRIPT_URL);

  url.searchParams.set("action", action);
  url.searchParams.set("t", Date.now());

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store"
  });

  return await response.json();
}

async function apiPost(action, payload = {}) {
  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      action,
      token: adminSession ? adminSession.token : "",
      ...payload
    })
  });

  return await response.json();
}

/* SESIÓN */

function showLogin() {
  if (loginScreen) loginScreen.classList.remove("hidden");
  if (dashboardScreen) dashboardScreen.classList.add("hidden");
}

function showDashboard() {
  if (loginScreen) loginScreen.classList.add("hidden");
  if (dashboardScreen) dashboardScreen.classList.remove("hidden");

  if (appsScriptUrlInput) {
    appsScriptUrlInput.value = APPS_SCRIPT_URL;
  }
}

function saveSession(session) {
  adminSession = session;
  localStorage.setItem("venevoAdminSession", JSON.stringify(session));
}

function clearSession() {
  adminSession = null;
  localStorage.removeItem("venevoAdminSession");
}

function checkSession() {
  if (adminSession && adminSession.logged === true) {
    showDashboard();
  } else {
    showLogin();
  }
}

function simpleLocalLogin(user, password) {
  const validUsers = [
    {
      user: "admin",
      password: "1234",
      role: "master"
    },
    {
      user: "pato",
      password: "venevo2026",
      role: "master"
    }
  ];

  return validUsers.find(item =>
    item.user === user &&
    item.password === password
  );
}

async function loginAdmin(event) {
  event.preventDefault();

  const user = adminUser ? adminUser.value.trim() : "";
  const password = adminPassword ? adminPassword.value.trim() : "";

  if (!user || !password) {
    setMessage(loginMessage, "Ingresa usuario y contraseña.", "error");
    return;
  }

  try {
    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.textContent = "Validando...";
    }

    setMessage(loginMessage, "Validando acceso...", "");

    /*
      IMPORTANTE:
      Este login funciona primero de forma local para que puedas probar el admin.
      Usuario: admin
      Contraseña: 1234

      Después conectamos este login con Google Sheets usando Apps Script.
    */

    const localUser = simpleLocalLogin(user, password);

    if (!localUser) {
      setMessage(loginMessage, "Usuario o contraseña incorrectos.", "error");
      return;
    }

    saveSession({
      logged: true,
      user: localUser.user,
      role: localUser.role,
      token: `local-${Date.now()}`
    });

    setMessage(loginMessage, "Acceso correcto.", "success");

    setTimeout(() => {
      showDashboard();
    }, 350);

  } catch (error) {
    console.log(error);
    setMessage(loginMessage, "No se pudo iniciar sesión.", "error");
  } finally {
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.textContent = "Ingresar al panel";
    }
  }
}

function logoutAdmin() {
  clearSession();
  showLogin();
}

/* TABS */

function setupTabs() {
  adminTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const panelId = tab.dataset.panel;

      adminTabs.forEach(item => item.classList.remove("active"));
      adminPanels.forEach(panel => panel.classList.remove("active-panel"));

      tab.classList.add("active");

      const targetPanel = document.getElementById(panelId);

      if (targetPanel) {
        targetPanel.classList.add("active-panel");
      }
    });
  });
}

/* DATOS */

async function loadAdminData() {
  try {
    const response = await apiGet("adminData");

    if (response && response.success) {
      adminRadios = Array.isArray(response.radios) ? response.radios : [];
      adminFrecuencias = Array.isArray(response.frecuencias) ? response.frecuencias : [];
      adminSolicitudes = Array.isArray(response.solicitudes) ? response.solicitudes : [];
      return true;
    }

    const publicResponse = await fetch(`${APPS_SCRIPT_URL}?t=${Date.now()}`, {
      cache: "no-store"
    });

    const publicData = await publicResponse.json();

    adminRadios = publicData.radios ? Object.entries(publicData.radios).map(([id, value]) => ({
      id,
      nombre: id.toUpperCase(),
      stream: value.stream || "",
      streamVideo: value.streamVideo || "",
      apiNowPlaying: value.apiNowPlaying || "",
      color1: value.color1 || "#FF4B00",
      color2: value.color2 || "#FFD000",
      estado: "ocupado",
      activo: "si"
    })) : [];

    adminFrecuencias = Array.isArray(publicData.frecuencias) ? publicData.frecuencias : [];
    adminSolicitudes = Array.isArray(publicData.solicitudes) ? publicData.solicitudes : [];

    return true;

  } catch (error) {
    console.log(error);
    return false;
  }
}

/* RADIOS */

function normalizeRadio(item) {
  return {
    id: getValue(item, ["id", "ID"], ""),
    nombre: getValue(item, ["nombre", "NOMBRE", "name", "RADIO", "radio"], ""),
    stream: getValue(item, ["stream", "STREAM"], ""),
    apiNowPlaying: getValue(item, ["apiNowPlaying", "API_NOWPLAYING", "metadataApi"], ""),
    streamingLive: getValue(item, ["streamingLive", "STREAMING_LIVE", "streamVideo"], ""),
    color1: safeColor(getValue(item, ["color1", "COLOR_1"], "#FF4B00"), "#FF4B00"),
    color2: safeColor(getValue(item, ["color2", "COLOR_2"], "#FFD000"), "#FFD000"),
    estado: getValue(item, ["estado", "ESTADO"], "ocupado"),
    activo: getValue(item, ["activo", "ACTIVO"], "si")
  };
}

async function loadRadios() {
  showLoading(radiosList, "Cargando radios principales...");

  const loaded = await loadAdminData();

  if (!loaded) {
    showEmpty(radiosList, "No se pudo cargar radios.");
    return;
  }

  renderRadios();
}

function renderRadios() {
  if (!radiosList) return;

  radiosList.innerHTML = "";

  if (!adminRadios.length) {
    showEmpty(radiosList, "No hay radios registradas.");
    return;
  }

  adminRadios.forEach(rawItem => {
    const radio = normalizeRadio(rawItem);

    const card = document.createElement("article");
    card.className = "admin-card";

    card.innerHTML = `
      <div class="admin-card-row">
        <div>
          <h4>${radio.nombre || radio.id || "Radio"}</h4>
          <p>${radio.stream ? "Stream configurado" : "Sin stream de audio"}</p>
        </div>
        <span class="admin-pill ${radio.activo === "si" ? "success" : "error"}">
          ${radio.activo === "si" ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div class="admin-card-meta">
        <span class="admin-pill">${radio.id || "sin id"}</span>
        <span class="admin-pill">${radio.estado || "sin estado"}</span>
      </div>

      <p><strong>Audio:</strong> ${radio.stream || "No configurado"}</p>
      <p><strong>Streaming:</strong> ${radio.streamingLive || "No configurado"}</p>

      <div class="admin-card-actions">
        <button class="admin-small-btn primary" data-action="edit-radio" data-id="${radio.id}">
          Editar
        </button>
      </div>
    `;

    radiosList.appendChild(card);
  });

  radiosList.querySelectorAll("[data-action='edit-radio']").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const item = adminRadios.find(r => normalizeRadio(r).id === id);
      openEditModal("radio", item);
    });
  });
}

/* FRECUENCIAS */

function normalizeFrequency(item) {
  return {
    id: getValue(item, ["id", "ID"], ""),
    pais: getValue(item, ["pais", "PAIS"], ""),
    provincia: getValue(item, ["provincia", "PROVINCIA_DEPARTAMENTO"], ""),
    frecuencia: getValue(item, ["frecuencia", "FRECUENCIA"], ""),
    precio: getValue(item, ["precio", "PRECIO"], ""),
    radioReferencia: getValue(item, ["radioReferencia", "RADIO_REFERENCIA"], ""),
    stream: getValue(item, ["stream", "STREAM"], ""),
    apiNowPlaying: getValue(item, ["apiNowPlaying", "API_NOWPLAYING"], ""),
    streamingLive: getValue(item, ["streamingLive", "STREAMING_LIVE"], ""),
    color1: safeColor(getValue(item, ["color1", "COLOR_1"], "#FF4B00"), "#FF4B00"),
    color2: safeColor(getValue(item, ["color2", "COLOR_2"], "#FFD000"), "#FFD000"),
    estado: getValue(item, ["estado", "ESTADO"], "libre").toLowerCase(),
    activo: getValue(item, ["activo", "ACTIVO"], "si").toLowerCase()
  };
}

async function loadFrecuencias() {
  showLoading(frecuenciasList, "Cargando frecuencias digitales...");

  const loaded = await loadAdminData();

  if (!loaded) {
    showEmpty(frecuenciasList, "No se pudo cargar frecuencias.");
    return;
  }

  renderFrecuencias();
}

function renderFrecuencias() {
  if (!frecuenciasList) return;

  const search = normalizeText(frequencySearchAdmin ? frequencySearchAdmin.value : "");

  const items = adminFrecuencias
    .map(normalizeFrequency)
    .filter(item => {
      if (!search) return true;

      return (
        normalizeText(item.pais).includes(search) ||
        normalizeText(item.provincia).includes(search) ||
        normalizeText(item.frecuencia).includes(search) ||
        normalizeText(item.radioReferencia).includes(search)
      );
    });

  frecuenciasList.innerHTML = "";

  if (!items.length) {
    showEmpty(frecuenciasList, "No hay frecuencias con esa búsqueda.");
    return;
  }

  items.forEach(item => {
    const ocupado = item.estado === "ocupado";

    const card = document.createElement("article");
    card.className = "admin-card";

    card.innerHTML = `
      <div class="admin-card-row">
        <div>
          <h4>${item.frecuencia} FD</h4>
          <p>${item.pais} / ${item.provincia}</p>
        </div>
        <span class="admin-pill ${ocupado ? "error" : "success"}">
          ${ocupado ? "Ocupado" : "Libre"}
        </span>
      </div>

      <div class="admin-card-meta">
        <span class="admin-pill">${item.id || "sin id"}</span>
        <span class="admin-pill">$${item.precio || "Consultar"}</span>
        <span class="admin-pill ${item.activo === "si" ? "success" : "error"}">
          ${item.activo === "si" ? "Activo" : "Inactivo"}
        </span>
      </div>

      <p><strong>Radio:</strong> ${item.radioReferencia || "Sin radio asignada"}</p>
      <p><strong>Stream:</strong> ${item.stream || "No configurado"}</p>

      <div class="admin-card-actions">
        <button class="admin-small-btn primary" data-action="edit-frequency" data-id="${item.id}">
          Editar
        </button>
      </div>
    `;

    frecuenciasList.appendChild(card);
  });

  frecuenciasList.querySelectorAll("[data-action='edit-frequency']").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const item = adminFrecuencias.find(f => normalizeFrequency(f).id === id);
      openEditModal("frecuencia", item);
    });
  });
}

/* SOLICITUDES */

function normalizeSolicitud(item) {
  return {
    id: getValue(item, ["id", "ID", "ID_FRECUENCIA"], ""),
    pais: getValue(item, ["pais", "PAIS"], ""),
    provincia: getValue(item, ["provincia", "PROVINCIA_DEPARTAMENTO"], ""),
    frecuencia: getValue(item, ["frecuencia", "FRECUENCIA"], ""),
    radioSolicitada: getValue(item, ["radioSolicitada", "RADIO_SOLICITADA"], ""),
    titular: getValue(item, ["titular", "TITULAR"], ""),
    whatsapp: getValue(item, ["whatsapp", "WHATSAPP"], ""),
    correo: getValue(item, ["correo", "CORREO"], ""),
    stream: getValue(item, ["stream", "STREAM"], ""),
    apiNowPlaying: getValue(item, ["apiNowPlaying", "API_NOWPLAYING"], ""),
    streamingLive: getValue(item, ["streamingLive", "STREAMING_LIVE"], ""),
    color1: safeColor(getValue(item, ["color1", "COLOR_1"], "#FF4B00"), "#FF4B00"),
    color2: safeColor(getValue(item, ["color2", "COLOR_2"], "#FFD000"), "#FFD000"),
    estado: getValue(item, ["estado", "ESTADO"], "pendiente")
  };
}

async function loadSolicitudes() {
  showLoading(solicitudesList, "Cargando solicitudes...");

  const loaded = await loadAdminData();

  if (!loaded) {
    showEmpty(solicitudesList, "No se pudo cargar solicitudes.");
    return;
  }

  renderSolicitudes();
}

function renderSolicitudes() {
  if (!solicitudesList) return;

  solicitudesList.innerHTML = "";

  if (!adminSolicitudes.length) {
    showEmpty(solicitudesList, "No hay solicitudes recibidas.");
    return;
  }

  adminSolicitudes.map(normalizeSolicitud).forEach(item => {
    const card = document.createElement("article");
    card.className = "admin-card";

    card.innerHTML = `
      <div class="admin-card-row">
        <div>
          <h4>${item.radioSolicitada || "Solicitud de radio"}</h4>
          <p>${item.frecuencia} FD · ${item.pais} / ${item.provincia}</p>
        </div>
        <span class="admin-pill">
          ${item.estado || "pendiente"}
        </span>
      </div>

      <p><strong>Titular:</strong> ${item.titular || "No registrado"}</p>
      <p><strong>WhatsApp:</strong> ${item.whatsapp || "No registrado"}</p>
      <p><strong>Correo:</strong> ${item.correo || "No registrado"}</p>
      <p><strong>Stream:</strong> ${item.stream || "No configurado"}</p>

      <div class="admin-card-actions">
        <button class="admin-small-btn primary" data-action="edit-request" data-id="${item.id}">
          Revisar
        </button>
      </div>
    `;

    solicitudesList.appendChild(card);
  });

  solicitudesList.querySelectorAll("[data-action='edit-request']").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const item = adminSolicitudes.find(s => normalizeSolicitud(s).id === id);
      openEditModal("solicitud", item);
    });
  });
}

/* MODAL EDITAR */

function openEditModal(type, rawItem) {
  if (!editModal || !rawItem) return;

  let item;

  if (type === "radio") {
    item = normalizeRadio(rawItem);
    editModalTitle.textContent = `Editar ${item.nombre || item.id}`;
  }

  if (type === "frecuencia") {
    item = normalizeFrequency(rawItem);
    editModalTitle.textContent = `Editar ${item.frecuencia} FD`;
  }

  if (type === "solicitud") {
    item = normalizeSolicitud(rawItem);
    editModalTitle.textContent = `Revisar ${item.radioSolicitada || "solicitud"}`;
  }

  editType.value = type;
  editId.value = item.id || "";

  editRadioName.value =
    item.nombre ||
    item.radioReferencia ||
    item.radioSolicitada ||
    "";

  editStream.value = item.stream || "";
  editApiNowPlaying.value = item.apiNowPlaying || "";
  editStreamingLive.value = item.streamingLive || "";
  editColor1.value = safeColor(item.color1, "#FF4B00");
  editColor2.value = safeColor(item.color2, "#FFD000");
  editEstado.value = item.estado === "ocupado" ? "ocupado" : "libre";
  editActivo.value = item.activo === "no" ? "no" : "si";

  setMessage(editMessage, "", "");

  editModal.classList.remove("hidden");
}

function closeEditModal() {
  if (!editModal) return;

  editModal.classList.add("hidden");
}

async function saveEdit(event) {
  event.preventDefault();

  const payload = {
    tipo: editType.value,
    id: editId.value,
    nombreRadio: editRadioName.value.trim(),
    stream: editStream.value.trim(),
    apiNowPlaying: editApiNowPlaying.value.trim(),
    streamingLive: editStreamingLive.value.trim(),
    color1: editColor1.value,
    color2: editColor2.value,
    estado: editEstado.value,
    activo: editActivo.value
  };

  if (!payload.id) {
    setMessage(editMessage, "No se encontró el ID del registro.", "error");
    return;
  }

  try {
    setMessage(editMessage, "Guardando cambios...", "");

    const response = await apiPost("updateAdminItem", payload);

    if (!response || response.success !== true) {
      /*
        Por ahora dejamos este mensaje porque todavía falta crear
        la función updateAdminItem en Apps Script.
      */
      setMessage(editMessage, "Falta conectar el guardado con Apps Script.", "error");
      return;
    }

    setMessage(editMessage, "Cambios guardados correctamente.", "success");

    await loadAdminData();

    renderRadios();
    renderFrecuencias();
    renderSolicitudes();

    setTimeout(() => {
      closeEditModal();
    }, 700);

  } catch (error) {
    console.log(error);
    setMessage(editMessage, "No se pudo guardar. Revisa Apps Script.", "error");
  }
}

/* CONFIG */

function saveConfig() {
  const url = appsScriptUrlInput ? appsScriptUrlInput.value.trim() : "";

  if (!url) {
    setMessage(configMessage, "Ingresa una URL válida.", "error");
    return;
  }

  APPS_SCRIPT_URL = url;
  localStorage.setItem("venevoAdminAppsScriptUrl", url);

  setMessage(configMessage, "Configuración guardada.", "success");
}

/* EVENTOS */

if (loginForm) {
  loginForm.addEventListener("submit", loginAdmin);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logoutAdmin);
}

if (loadRadiosBtn) {
  loadRadiosBtn.addEventListener("click", loadRadios);
}

if (loadFrecuenciasBtn) {
  loadFrecuenciasBtn.addEventListener("click", loadFrecuencias);
}

if (loadSolicitudesBtn) {
  loadSolicitudesBtn.addEventListener("click", loadSolicitudes);
}

if (frequencySearchAdmin) {
  frequencySearchAdmin.addEventListener("input", renderFrecuencias);
}

if (saveConfigBtn) {
  saveConfigBtn.addEventListener("click", saveConfig);
}

if (editForm) {
  editForm.addEventListener("submit", saveEdit);
}

if (closeEditModalBtn) {
  closeEditModalBtn.addEventListener("click", closeEditModal);
}

if (editModalOverlay) {
  editModalOverlay.addEventListener("click", closeEditModal);
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeEditModal();
  }
});

/* INICIO */

setupTabs();
checkSession();

if (appsScriptUrlInput) {
  appsScriptUrlInput.value = APPS_SCRIPT_URL;
}
