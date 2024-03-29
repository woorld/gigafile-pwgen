import { StorageKey, settingParams } from './constants';

const initSettingVal = (storageKey: StorageKey): void => {
  chrome.storage.sync.get([storageKey], (result) => {
    if (result[storageKey] != null) {
      return;
    }
    const { defaultValue } = settingParams.filter(param => param.storageKey === storageKey)[0];
    chrome.storage.sync.set({ [storageKey]: defaultValue });
  });
};

chrome.runtime.onInstalled.addListener((details) => {
  initSettingVal('isEnable');
  initSettingVal('isCopyToClipboard');
  initSettingVal('copiedNoticeType');

  if (details.reason === 'update') {
    chrome.storage.sync.set({ isUpdate: true });
  }
});
