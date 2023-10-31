const initSettingVal = (settingKey: string): void => {
  chrome.storage.sync.get([settingKey], (result) => {
    if (result[settingKey] != null) {
      return;
    }
    chrome.storage.sync.set({ [settingKey]: true });
  });
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    initSettingVal('isEnable');
    initSettingVal('isCopyToClipboard');
  }
  else if (details.reason === 'update') {
    chrome.storage.sync.set({ isUpdate: true });
  }
});
