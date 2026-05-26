const playBtn = document.getElementById("playBtn");
const radioPlayer = document.getElementById("radioPlayer");
const visualizer = document.querySelector(".visualizer");

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
