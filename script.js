/* ========================= */
/* REEMPLAZA TODO TU SCRIPT */
/* ========================= */

const radios = [

{
  name:"LA FAN",
  number:"90.5",
  subtitle:"POP • TOP HITS",
  theme:"lafan-theme",
  stream:"https://radio.megahostec.com/listen/radio_la_fan_fm/stream",
  logoVideo:"introlafanlogo.mp4",
  streaming:"https://www.youtube.com/embed/36YnV9STBqc"
},

{
  name:"CLIP",
  number:"80.5",
  subtitle:"MÚSICA • HITS",
  theme:"clip-theme",
  stream:"https://radio.megahostec.com/listen/radio_clipfm/stream",
  logoVideo:"introcliplogo.mp4",
  streaming:"https://www.youtube.com/embed/HnUvZH5PBko"
},

{
  name:"OYE",
  number:"93.5",
  subtitle:"ENERGÍA • DIGITAL",
  theme:"oye-theme",
  stream:"https://radio.megahostec.com/listen/radio_oyefm/stream",
  logoVideo:"introoyelogo.mp4",
  streaming:"https://www.youtube.com/embed/36YnV9STBqc"
},

{
  name:"POX",
  number:"100.5",
  subtitle:"ENTRETENIMIENTO • LIVE",
  theme:"pox-theme",
  stream:"https://radio.megahostec.com/listen/radio_pox_edmo/stream",
  logoVideo:"poxvideo.mp4",
  streaming:"https://www.youtube.com/embed/36YnV9STBqc"
}

];

let currentRadio = 0;
let isPlaying = false;

const splashScreen = document.getElementById("splashScreen");
const mainApp = document.getElementById("mainApp");

const dialNumber = document.getElementById("dialNumber");
const dialRadioName = document.getElementById("dialRadioName");
const radioTitle = document.getElementById("radioTitle");
const radioNameTop = document.getElementById("radioNameTop");
const dialSubtitle = document.getElementById("dialSubtitle");

const radioLogoVideo =
document.getElementById("radioLogoVideo");

const radioPlayer =
document.getElementById("radioPlayer");

const playBtn =
document.getElementById("playBtn");

const prevRadio =
document.getElementById("prevRadio");

const nextRadio =
document.getElementById("nextRadio");

const radioTab =
document.getElementById("radioTab");

const streamingTab =
document.getElementById("streamingTab");

const radioSection =
document.getElementById("radioSection");

const streamingSection =
document.getElementById("streamingSection");

const streamingFrame =
document.getElementById("streamingFrame");

setTimeout(() => {

  splashScreen.classList.add("hidden");
  mainApp.classList.remove("hidden");

}, 3500);

function loadRadio(index){

  const radio = radios[index];

  document.body.className = radio.theme;

  dialNumber.textContent = radio.number;

  dialRadioName.textContent = radio.name;

  radioTitle.textContent = radio.name;

  radioNameTop.textContent = radio.name;

  dialSubtitle.textContent = radio.subtitle;

  radioLogoVideo.src = radio.logoVideo;

  streamingFrame.src = radio.streaming;

  radioPlayer.src = radio.stream;

  if(isPlaying){

    radioPlayer.play();

  }

}

playBtn.addEventListener("click", async()=>{

  if(!isPlaying){

    await radioPlayer.play();

    isPlaying = true;

    playBtn.innerHTML = "❚❚";

  }else{

    radioPlayer.pause();

    isPlaying = false;

    playBtn.innerHTML = "▶";

  }

});

nextRadio.addEventListener("click", ()=>{

  currentRadio++;

  if(currentRadio >= radios.length){

    currentRadio = 0;

  }

  loadRadio(currentRadio);

});

prevRadio.addEventListener("click", ()=>{

  currentRadio--;

  if(currentRadio < 0){

    currentRadio = radios.length - 1;

  }

  loadRadio(currentRadio);

});

streamingTab.addEventListener("click", ()=>{

  radioTab.classList.remove("active-switch");
  streamingTab.classList.add("active-switch");

  radioSection.classList.add("hidden");
  streamingSection.classList.remove("hidden");

});

radioTab.addEventListener("click", ()=>{

  streamingTab.classList.remove("active-switch");
  radioTab.classList.add("active-switch");

  streamingSection.classList.add("hidden");
  radioSection.classList.remove("hidden");

});

loadRadio(currentRadio);
