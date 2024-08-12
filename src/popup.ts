import { settingParams } from './constants';
import van from 'vanjs-core';

const { li, label, span, div, input, select, option } = van.tags;

const toKebabCase = (str: string) => str.replace(/[A-Z0-9]/g, repstr => '-' + repstr.toLowerCase());

window.addEventListener('load', async () => {
  const settingList = document.getElementById('setting-list');

  // 設定項目リストから設定画面を生成して#setting-listに格納
  for (const settingParam of settingParams) {
    const { storageKey } = settingParam;
    const kebabStorageKey = toKebabCase(storageKey);
    const settedValue = (await chrome.storage.sync.get(storageKey))[storageKey];

    // 設定項目の<li>
    const inputRow = li({ class: 'input-row' });

    // 項目名のラベル
    const settingLabel = label({ for: kebabStorageKey }, settingParam.label);

    if (settingParam.requireReload) {
      const mark = span({ class: 'require-reload-mark' });
      van.add(settingLabel, mark);
    }

    if (settingParam.type === 'Toggle') {
      // オンオフスイッチラッパー
      const checkbox = div({ class: 'checkbox' });

      // TODO: checkboxにネストさせる
      // オンオフスイッチ本体
      const checkboxInput = input({
        id: kebabStorageKey,
        type: 'checkbox',
        checked: settedValue,
      });

      // TODO: checkboxにネストさせる
      // オンオフスイッチの装飾用<label>
      const checkboxLabel = label({
        class: 'checkbox__switch',
        for: kebabStorageKey,
      });

      // TODO: VanJSのイベントハンドラにする
      // オンオフ時の設定値保存イベントの設定
      checkboxInput.addEventListener('change', async () => {
        await chrome.storage.sync.set({ [storageKey]: checkboxInput.checked });
      });

      // TODO: checkboxにネスとする形にしたら不要になるので削除
      van.add(checkbox, checkboxInput, checkboxLabel);

      van.add(inputRow, checkbox);
    }
    else if (settingParam.type === 'Select') {
      const settingSelect = select({
        id: kebabStorageKey,
        class: 'input-row__select',
      })

      for (const selectItem of settingParam.selectItems!) {
        // <select>内の各<option>を生成して格納
        const settingSelectOption = option({
          value: selectItem.storageValue,
          selected: selectItem.storageValue === settedValue,
        }, selectItem.label);

        van.add(settingSelect, settingSelectOption);
      }

      // TODO: VanJSのイベントハンドラにする
      // 選択変更時の設定値保存イベントの設定
      settingSelect.addEventListener('change', async () => {
        await chrome.storage.sync.set({ [storageKey]: settingSelect.value });
      });

      van.add(inputRow, settingSelect);
    }

    // TODO: vanでのprependってどうすんの
    inputRow.prepend(settingLabel);
    van.add(settingList!, inputRow);
  }
});
