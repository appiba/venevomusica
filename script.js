const playBtn = document.getElementById("playBtn");
const radioPlayer = document.getElementById("radioPlayer");
const visualizer = document.querySelector(".visualizer");

const radioCards = document.querySelectorAll(".radio-card");

const mainTitle = document.getElementById("mainTitle");
const mainSubtitle = document.getElementById("mainSubtitle");
const radioTitle = document.getElementById("radioTitle");
const radioText = document.getElementById("radioText");
const coverImage = document.getElementById("coverImage");

const splashScreen = document.getElementById("splashScreen");
const splashVideo = document.getElementById("splashVideo");

let isPlaying = false;

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

if (splashVideo && splashScreen) {
  splashVideo.addEventListener("ended", () => {
    splashScreen.style.display = "none";
  });

  setTimeout(() => {
    splashScreen.style.display = "none";
  }, 5000);
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
    const image = card.dataset.image;
    const subtitle = card.dataset.subtitle;
    const video = card.dataset.video;

    radioCards.forEach(c => c.classList.remove("active-radio"));
    card.classList.add("active-radio");

    document.body.className = theme;

    mainTitle.textContent = name;
    mainSubtitle.textContent = subtitle;
    radioTitle.textContent = name;
    radioText.textContent = "Escucha la radio online desde cualquier lugar.";

    if (video) {
      coverImage.outerHTML = `
        <video
          id="coverImage"
          autoplay
          muted
          loop
          playsinline
          src="${video}">
        </video>
      `;
    } else {
      coverImage.src = image;
    }

    radioPlayer.pause();
    radioPlayer.src = stream;
    radioPlayer.load();

    await playRadio();
  });
});
