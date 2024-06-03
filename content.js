chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "play") {
        playVideo();
    } else if (request.action === "pause") {
        pauseVideo();
    }
});

function playVideo() {
    let video = document.querySelector('video');
    if (video && video.paused) {
        video.play();
    }
}

function pauseVideo() {
    let video = document.querySelector('video');
    if (video && !video.paused) {
        video.pause();
    }
}
