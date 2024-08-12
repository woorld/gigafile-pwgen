import van from 'vanjs-core';
import { settingParams } from './constants';
import { SettingList } from './components/popup/SettingList';
import { SettingListItem } from './components/popup/SettingListItem';

window.addEventListener('load', async () => {
  const settingList = SettingList();

  // 設定項目リストから設定画面を生成してSettingListに格納
  for (const settingParam of settingParams) {
    const settingListItem = await SettingListItem(settingParam);
    van.add(settingList, settingListItem);
  }

  van.add(document.body, settingList);
});
