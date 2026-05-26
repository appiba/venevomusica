const playBtn = document.getElementById("playBtn");
const radioPlayer = document.getElementById("radioPlayer");
const visualizer = document.querySelector(".visualizer");

const radioCards = document.querySelectorAll(".radio-card");

const mainTitle = document.getElementById("mainTitle");
const mainSubtitle = document.getElementById("mainSubtitle");
const radioTitle = document.getElementById("radioTitle");
const radioText = document.getElementById("radioText");
const coverImage = document.getElementById("coverImage");

let isPlaying = false;

playBtn.addEventListener("click", async () => {
  try {
    if (!isPlaying) {
      await radioPlayer.play();

      isPlaying = true;
      playBtn.textContent = "❚❚";
      playBtn.classList.add("playing");
      visualizer.classList.add("active");

    } else {
      radioPlayer.pause();

      isPlaying = false;
      playBtn.textContent = "▶";
      playBtn.classList.remove("playing");
      visualizer.classList.remove("active");
    }
  } catch (error) {
    alert("No se pudo reproducir la radio. Intenta nuevamente.");
  }
});

radioCards.forEach(card => {
  card.addEventListener("click", async () => {
    const name = card.dataset.name;
    const theme = card.dataset.theme;
    const stream = card.dataset.stream;
    const image = card.dataset.image;
    const subtitle = card.dataset.subtitle;

    radioCards.forEach(c => c.classList.remove("active-radio"));
    card.classList.add("active-radio");

    document.body.className = theme;

    mainTitle.textContent = name;
    mainSubtitle.textContent = subtitle;
    radioTitle.textContent = name;
    radioText.textContent = "Escucha la radio online desde cualquier lugar.";
    coverImage.src = image;

    radioPlayer.pause();
    radioPlayer.src = stream;
    radioPlayer.load();

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
  });
});
