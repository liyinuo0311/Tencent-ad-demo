const videoShell = document.querySelector("#videoShell");
const video = document.querySelector("#mainVideo");
const centerPlay = document.querySelector("#centerPlay");
const playToggle = document.querySelector("#playToggle");
const timeline = document.querySelector("#timeline");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const volume = document.querySelector("#volume");
const fullscreenToggle = document.querySelector("#fullscreenToggle");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "00:00";

  const totalSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateProgress() {
  const percent = video.duration ? (video.currentTime / video.duration) * 100 : 0;
  timeline.value = String(percent);
  timeline.style.setProperty("--progress", `${percent}%`);
  currentTime.textContent = formatTime(video.currentTime);
}

function updatePlayState() {
  const isPlaying = !video.paused && !video.ended;
  videoShell.classList.toggle("is-playing", isPlaying);
  centerPlay.setAttribute("aria-label", isPlaying ? "暂停" : "播放");
  playToggle.setAttribute("aria-label", isPlaying ? "暂停" : "播放");
}

async function togglePlay() {
  if (video.paused || video.ended) {
    await video.play();
  } else {
    video.pause();
  }
}

function seekToProgress() {
  if (!video.duration) return;
  video.currentTime = (Number(timeline.value) / 100) * video.duration;
}

async function toggleFullscreen() {
  if (!document.fullscreenElement) {
    await videoShell.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
}

video.volume = Number(volume.value);

video.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(video.duration);
  updateProgress();
});

video.addEventListener("timeupdate", updateProgress);
video.addEventListener("play", updatePlayState);
video.addEventListener("pause", updatePlayState);
video.addEventListener("ended", updatePlayState);
video.addEventListener("click", togglePlay);

centerPlay.addEventListener("click", togglePlay);
playToggle.addEventListener("click", togglePlay);
timeline.addEventListener("input", seekToProgress);

volume.addEventListener("input", () => {
  video.volume = Number(volume.value);
});

fullscreenToggle.addEventListener("click", toggleFullscreen);

document.addEventListener("keydown", (event) => {
  if (event.code === "Space" && event.target === document.body) {
    event.preventDefault();
    togglePlay();
  }
});

updatePlayState();
