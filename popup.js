document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('extensionToggle');

    chrome.storage.sync.get(['enabled'], (result) => {
        toggle.checked = result.enabled;
    });

    toggle.addEventListener('change', () => {
        chrome.storage.sync.set({ enabled: toggle.checked });
    });
});
