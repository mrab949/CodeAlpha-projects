const videoCount = document.querySelector('.count');
const img = document.getElementById('img');
const audio = document.querySelector('#audio');
const detailsElement = document.getElementById('detail');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const progressBar = document.querySelector('.progress-bar');
const progressBall = document.querySelector('.progress-ball');
const progressContainer = document.querySelector('.progress-container');
const crntTime = document.querySelector('.currentTime');
const duration = document.querySelector('.duration');
const loopBtn = document.getElementById('loop');
const repeatBtn = document.getElementById('repeat');

// Initial data
let images = ["assets/1t.png", "assets/lion.jpeg", "assets/ran.png", "assets/2t.jpeg", "assets/mypic.jpg", "assets/ran.png"];
let audioItems = ['assets/1.mp4', 'assets/2.mp3', 'assets/3t.mp4', 'assets/4.mp4', 'assets/51.mp4', 'assets/6.mp4', 'assets/767.mp4'];

let currentItem = 0;
let loop = false;
let repeat = false;

const initializePlayer = () => {
    if (audioItems.length === 0) {
        console.error("No audio files available.");
        return;
    }
    audio.src = audioItems[currentItem];
    videoCount.innerText = `1/${audioItems.length}`;
    detailsElement.innerHTML = getFileName(audioItems[currentItem]);
    img.src = images[currentItem % images.length];
};

// Get file name from the path
const getFileName = (filePath) => filePath.split('/').pop();

//button selectors 
const btnSelectorForPlay = ()=>{
    pauseBtn.style.display = 'flex';
    playBtn.style.display = 'none';
};

const btnSelectorForPause = ()=>{
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'flex';
};

// Play audio
const playAudio = () => {
    audio.play().catch((error) => console.error("Error playing audio:", error));
    currentItem++;
    videoCount.innerText = `${currentItem}/${audioItems.length}`;
    currentItem--;
    btnSelectorForPlay();
    updateProgressBar();
};

// Pause audio
const pauseAudio = () => {
    audio.pause();
};

// Update audio
const updateAudio = () => {
    pauseAudio();
    audio.currentTime = 0;
    audio.src = audioItems[currentItem];
    img.src = images[currentItem % images.length];
    nextBtn.style.opacity = currentItem === audioItems.length - 1 ? '0.4' : '1';
    detailsElement.innerHTML = getFileName(audioItems[currentItem]);
    playAudio();
};

// Loop button click handler
const toggleLoop = () => {
    loop = !loop;
    loopBtn.style.color = loop ? 'aqua' : 'black';
    repeat = false;
    repeatBtn.style.color = 'black';
};

// Repeat button click handler
const toggleRepeat = () => {
    repeat = !repeat;
    repeatBtn.style.color = repeat ? 'aqua' : 'black';
    loop = false;
    loopBtn.style.color = 'black';
};

// Next button click handler
const playNext = () => {
    if (currentItem < audioItems.length - 1) {
        currentItem++;
        updateAudio();
    }
};

// Previous button click handler
const playPrevious = () => {
    if (currentItem > 0) {
        currentItem--;
        updateAudio();
    } else {
        resetProgress();
    }
};

// Reset progress bar
const resetProgress = () => {
    progressBar.style.width = '0px';
    progressBall.style.left = '0%';
    crntTime.innerHTML = '00:00';
    audio.currentTime = 0;
};

// End of audio handler
const handleEnd = () => {
    if (loop) {
        playAudio();
    } else if (repeat) {
        currentItem = (currentItem + 1) % audioItems.length;
        updateAudio();
    } else {
        btnSelectorForPause();
        resetProgress();
    }
};

// Format time
const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Update progress bar
const updateProgressBar = () => {
    audio.addEventListener('timeupdate', () => {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        progressBall.style.left = `${progressPercent}%`;
        crntTime.innerHTML = formatTime(audio.currentTime);
        duration.innerHTML = formatTime(audio.duration || 0);
        (playBtn.style.display === 'flex')? img.classList.remove('glowing-border'):img.classList.add('glowing-border');

        if (audio.ended) {
            handleEnd();
        }
    });
};

// Progress bar click handler
progressContainer.addEventListener('click', (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;
    audio.currentTime = clickPercent * audio.duration;
});

// Dragging functionality
let isDragging = false;

const startDrag = (e) => {
    isDragging = true;
    pauseAudio();
};

const dragMove = (e) => {
    if (isDragging) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const rect = progressContainer.getBoundingClientRect();
        let offsetX = clientX - rect.left;
        offsetX = Math.max(0, Math.min(offsetX, rect.width));
        const clickPercent = offsetX / rect.width;
        progressBar.style.width = `${clickPercent * 100}%`;
        progressBall.style.left = `${clickPercent * 100}%`;
        audio.currentTime = clickPercent * audio.duration;
    }
};

const stopDrag = () => {
    if (isDragging) {
        isDragging = false;
        playAudio();
    }
};

progressBall.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', dragMove);
document.addEventListener('mouseup', stopDrag);
progressBall.addEventListener('touchstart', startDrag);
document.addEventListener('touchmove', dragMove);
document.addEventListener('touchend', stopDrag);

// Event listeners for buttons
loopBtn.addEventListener('click', toggleLoop);
repeatBtn.addEventListener('click', toggleRepeat);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrevious);
playBtn.addEventListener('click', () => {
    playAudio();
    btnSelectorForPlay();
});
pauseBtn.addEventListener('click', () => {
    pauseAudio();
    btnSelectorForPause();
});

// Initialize the player
initializePlayer();