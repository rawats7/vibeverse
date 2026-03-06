const playlist = document.getElementById("playlist");
const audio = document.getElementById("audio");
const progressBar = document.getElementById("progressBar");
const volume = document.getElementById("volume");
const timeDisplay = document.getElementById("time");
const searchInput = document.getElementById("searchInput");
const notFoundMessage = document.getElementById("notFoundMessage");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const coverEl = document.getElementById("cover");

let songs = [];
let currentIndex = 0;
let isPlaying = false;

// Fetch songs from JSON
fetch("songs.json")
  .then(res => res.json())
  .then(data => {
    songs = data;
    renderSongs(songs);
    loadSong();
  })
  .catch(err => console.error("Error loading songs:", err));

function renderSongs(songList) {
  playlist.innerHTML = "";
  songList.forEach((song, index) => {
    const div = document.createElement("div");
    div.className = "song";
    div.innerHTML = `
      <img src="${song.cover}">
      <div class="song-info">
        <div>${song.title}</div>
        <div style="font-size:12px; opacity:0.7;">${song.artist}</div>
      </div>`;
    div.onclick = () => selectSong(index);
    playlist.appendChild(div);
  });
}

function selectSong(index) {
  currentIndex = index;
  loadSong();
  playSong();
}

function loadSong() {
  const song = songs[currentIndex];
  if (!song) return; // safety check
  audio.src = song.file;
  titleEl.innerText = song.title;
  artistEl.innerText = song.artist;
  coverEl.src = song.cover;

  // Highlight active song
  document.querySelectorAll(".song").forEach((el, idx) => {
    el.classList.toggle("active", idx === currentIndex);
  });
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    document.querySelector(".controls button:nth-child(2)").innerText = "▶";
  } else {
    audio.play();
    document.querySelector(".controls button:nth-child(2)").innerText = "⏸";
  }
  isPlaying = !isPlaying;
}

function playSong() {
  audio.play();
  isPlaying = true;
  document.querySelector(".controls button:nth-child(2)").innerText = "⏸";
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong();
  playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong();
  playSong();
}

// Update progress bar
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progressBar.style.width = percent + "%";
  timeDisplay.innerText = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});


// Seek function
function seek(e) {
  const width = e.currentTarget.clientWidth;
  audio.currentTime = (e.offsetX / width) * audio.duration;
}

// Volume control
volume.addEventListener("input", () => audio.volume = volume.value);

// Search function
searchInput.addEventListener("input", function () {
  const value = this.value.toLowerCase();
  const filtered = songs.filter(song =>
    song.title.toLowerCase().includes(value) ||
    song.artist.toLowerCase().includes(value)
  );

  if (filtered.length === 0) {
    playlist.innerHTML = "";
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
    renderSongs(filtered);
  }
});

// Format time helper
function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}



const playPauseBtn = document.getElementById("playPauseBtn");

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerText = "▶";
        coverEl.classList.remove("playing"); // stop spinning
    } else {
        audio.play();
        playPauseBtn.innerText = "⏸";
        coverEl.classList.add("playing"); // start spinning
    }
    isPlaying = !isPlaying;
}

function playSong() {
    audio.play();
    isPlaying = true;
    playPauseBtn.innerText = "⏸";
    coverEl.classList.add("playing"); // spinning when song starts
}

audio.addEventListener("ended", () => {
    coverEl.classList.remove("playing"); // stop spinning when song ends
    nextSong();
});


const progressContainer = document.getElementById("progressContainer");


// Update progress bar as song plays
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + "%";
        updateTimeDisplay();
    }
});

// Click on progress bar to jump to that point
progressContainer.addEventListener("click", (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = offsetX / width;
    audio.currentTime = clickPercent * audio.duration;
});

// Update displayed time
function updateTimeDisplay(){
    const curMinutes = Math.floor(audio.currentTime / 60);
    const curSeconds = Math.floor(audio.currentTime % 60).toString().padStart(2,'0');
    const durMinutes = Math.floor(audio.duration / 60);
    const durSeconds = Math.floor(audio.duration % 60).toString().padStart(2,'0');
    timeDisplay.innerText = `${curMinutes}:${curSeconds} / ${durMinutes}:${durSeconds}`;
}


