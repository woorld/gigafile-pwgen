import { settingParams } from './constants';
import van from 'vanjs-core';

const { li, label, span, div, input, select, option } = van.tags;

const toKebabCase = (str: string) => str.replace(/[A-Z0-9]/g, repstr => '-' + repstr.toLowerCase());

// event.targetの型付け用
interface HTMLEvent<T extends EventTarget> extends Event {
  target: T;
}

window.addEventListener('load', async () => {
  const settingList = document.getElementById('setting-list');

  // 設定項目リストから設定画面を生成して#setting-listに格納
  for (const settingParam of settingParams) {
    const { storageKey } = settingParam;
    const kebabStorageKey = toKebabCase(storageKey);
    const settedValue = (await chrome.storage.sync.get(storageKey))[storageKey];

    // 項目名のラベル
    const settingLabel = label({ for: kebabStorageKey }, settingParam.label);

    if (settingParam.requireReload) {
      const mark = span({ class: 'require-reload-mark' });
      van.add(settingLabel, mark);
    }

    // 設定項目の<li>
    const inputRow = li({ class: 'input-row' }, settingLabel);

    if (settingParam.type === 'Toggle') {
      // オンオフスイッチラッパー
      const checkbox = div({ class: 'checkbox' },
        // オンオフスイッチ本体
        input({
          id: kebabStorageKey,
          type: 'checkbox',
          checked: settedValue,
          // オンオフ時に設定値を保存する
          onchange: async (e: HTMLEvent<HTMLInputElement>) => {
            await chrome.storage.sync.set({ [storageKey]: e.target.checked });
          },
        }),
        // オンオフスイッチの装飾用<label>
        label({
          class: 'checkbox__switch',
          for: kebabStorageKey,
        }),
      );

      van.add(inputRow, checkbox);
    }
    else if (settingParam.type === 'Select') {
      const settingSelect = select({
        id: kebabStorageKey,
        class: 'input-row__select',
        // 選択変更時に設定値を保存する
        onchange: async (e: HTMLEvent<HTMLSelectElement>) => {
          await chrome.storage.sync.set({ [storageKey]: e.target.value });
        },
      });

      for (const selectItem of settingParam.selectItems!) {
        // <select>内の各<option>を生成して格納
        const settingSelectOption = option({
          value: selectItem.storageValue,
          selected: selectItem.storageValue === settedValue,
        }, selectItem.label);

        van.add(settingSelect, settingSelectOption);
      }

      van.add(inputRow, settingSelect);
    }

    van.add(settingList!, inputRow);
  }
});
