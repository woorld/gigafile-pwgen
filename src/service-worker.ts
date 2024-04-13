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
  // 各設定項目に設定値がなければデフォルト値で初期化
  const storageKeys = settingParams.map(param => param.storageKey);
  storageKeys.forEach(key => initSettingVal(key));

  if (details.reason === 'update') {
    chrome.storage.sync.set({ isUpdate: true });
  }
});
