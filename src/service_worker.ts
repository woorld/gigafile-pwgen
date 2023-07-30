const initSettingVal = (settingKey: string): void => {
  chrome.storage.sync.get([settingKey], (result) => {
    if (result[settingKey] != null) {
      return;
    }
    chrome.storage.sync.set({ [settingKey]: true });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  initSettingVal('isEnable');
  initSettingVal('isCopyToClipboard');
});
