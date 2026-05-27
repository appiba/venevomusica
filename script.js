const playBtn = document.getElementById("playBtn");
const radioPlayer = document.getElementById("radioPlayer");
const visualizer = document.querySelector(".visualizer");

const radioCards = document.querySelectorAll(".radio-card");

const mainTitle = document.getElementById("mainTitle");
const mainSubtitle = document.getElementById("mainSubtitle");
const radioTitle = document.getElementById("radioTitle");
const radioText = document.getElementById("radioText");
const coverBox = document.getElementById("coverBox");

const splashScreen = document.getElementById("splashScreen");
const splashVideo = document.getElementById("splashVideo");

let isPlaying = false;

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

playBtn.addEventListener("click", async () => {
  if (!isPlaying) {
    await playRadio();
  } else {
    stopRadio();
  }
});

radioCards.forEach(card => {
  card.addEventListener("click", async () => {
    const name = card.dataset.name;
    const theme = card.dataset.theme;
    const stream = card.dataset.stream;
    const video = card.dataset.video;
    const subtitle = card.dataset.subtitle;

    radioCards.forEach(c => c.classList.remove("active-radio"));
    card.classList.add("active-radio");

    document.body.className = theme;

    mainTitle.textContent = name;
    mainSubtitle.textContent = subtitle;
    radioTitle.textContent = name;
    radioText.textContent = "Escucha la radio online desde cualquier lugar.";

    coverBox.innerHTML = `
      <video
        id="coverMedia"
        autoplay
        muted
        loop
        playsinline
        src="${video}">
      </video>
    `;

    radioPlayer.pause();
    radioPlayer.src = stream;
    radioPlayer.load();

    await playRadio();
  });
});
