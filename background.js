chrome.storage.sync.get(['enabled'], (result) => {
    if (result.enabled) {
        activateListeners();
    }
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && 'enabled' in changes) {
        if (changes.enabled.newValue) {
            activateListeners();
        } else {
            deactivateListeners();
        }
    }
});

function activateListeners() {
    chrome.tabs.onActivated.addListener(handleTabActivated);
    chrome.tabs.onUpdated.addListener(handleTabUpdated);
    chrome.windows.onFocusChanged.addListener(handleWindowFocusChanged);
}

function deactivateListeners() {
    chrome.tabs.onActivated.removeListener(handleTabActivated);
    chrome.tabs.onUpdated.removeListener(handleTabUpdated);
    chrome.windows.onFocusChanged.removeListener(handleWindowFocusChanged);
}

function handleTabActivated(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url.includes("youtube.com/watch")) {
            chrome.scripting.executeScript({
                target: { tabId: activeInfo.tabId },
                function: playVideo
            });
        } else {
            chrome.tabs.query({ url: "*://www.youtube.com/*" }, (tabs) => {
                tabs.forEach((tab) => {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        function: pauseVideo
                    });
                });
            });
        }
    });
}

function handleTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url.includes("youtube.com/watch")) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: playVideo
        });
    }
}

function handleWindowFocusChanged(windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        chrome.tabs.query({ url: "*://www.youtube.com/*" }, (tabs) => {
            tabs.forEach((tab) => {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    function: pauseVideo
                });
            });
        });
    } else {
        chrome.windows.get(windowId, { populate: true }, (window) => {
            window.tabs.forEach((tab) => {
                if (tab.active && tab.url.includes("youtube.com/watch")) {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        function: playVideo
                    });
                }
            });
        });
    }
}

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
