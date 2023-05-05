chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['isEnable'], (result) => {
    if (result.isEnable != null) {
      return;
    }
    chrome.storage.sync.set({ isEnable: true });
  });
});
