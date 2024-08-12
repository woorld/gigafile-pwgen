import van from 'vanjs-core';
import type { SettingParam } from '../../constants';
import { toKebabCase } from '../../util';
import type { HTMLEvent } from '../../util';

const { div, input, label, select, option } = van.tags;

export const SettingListItemInput = async (param: SettingParam) => {
  // TODO: クラス名をコンポーネント名に合わせて改修
  const { storageKey } = param;
  const kebabStorageKey = toKebabCase(storageKey);
  const settedValue = (await chrome.storage.sync.get(storageKey))[storageKey];

  // NOTE: SettingTypeが増えたらこちらも忘れず対応
  if (param.type === 'Toggle') {
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

    return checkbox;
  }
  else {
    const settingSelect = select({
      id: kebabStorageKey,
      class: 'input-row__select',
      // 選択変更時に設定値を保存する
      onchange: async (e: HTMLEvent<HTMLSelectElement>) => {
        await chrome.storage.sync.set({ [storageKey]: e.target.value });
      },
    });

    for (const selectItem of param.selectItems!) {
      // <select>内の各<option>を生成して格納
      const settingSelectOption = option({
        value: selectItem.storageValue,
        selected: selectItem.storageValue === settedValue,
      }, selectItem.label);

      van.add(settingSelect, settingSelectOption);
    }

    return settingSelect;
  }
};
