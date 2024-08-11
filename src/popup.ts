import { settingParams } from './constants';

const toKebabCase = (str: string) => str.replace(/[A-Z0-9]/g, repstr => '-' + repstr.toLowerCase());

window.addEventListener('load', async () => {
  const settingList = document.getElementById('setting-list');

  // 設定項目リストから設定画面を生成して#setting-listに格納
  for (const settingParam of settingParams) {
    const { storageKey } = settingParam;
    const kebabStorageKey = toKebabCase(storageKey);
    const settedValue = (await chrome.storage.sync.get(storageKey))[storageKey];

    // 設定項目の<li>
    const settingInput = document.createElement('li');
    settingInput.className = 'input-row';

    // 項目名のラベル
    const label = document.createElement('label');
    label.setAttribute('for', kebabStorageKey);
    label.textContent = settingParam.label;

    if (settingParam.requireReload) {
      const mark = document.createElement('span');
      mark.className = 'require-reload-mark';
      label.append(mark);
    }

    if (settingParam.type === 'Toggle') {
      // オンオフスイッチラッパー
      const checkbox = document.createElement('div');
      checkbox.className = 'checkbox';

      // オンオフスイッチ本体
      const checkboxInput = document.createElement('input');
      checkboxInput.id = kebabStorageKey;
      checkboxInput.setAttribute('type', 'checkbox');

      // オンオフスイッチの装飾用<label>
      const checkboxLabel = document.createElement('label');
      checkboxLabel.className = 'checkbox__switch';
      checkboxLabel.setAttribute('for', kebabStorageKey);

      // ストレージに設定された値との同期
      checkboxInput.checked = settedValue;

      // オンオフ時の設定値保存イベントの設定
      checkboxInput.addEventListener('change', async () => {
        await chrome.storage.sync.set({ [storageKey]: checkboxInput.checked });
      });

      // TODO: append()で一度に複数追加するよう修正（ほかの箇所も含めて）
      checkbox.appendChild(checkboxInput);
      checkbox.appendChild(checkboxLabel);
      settingInput.appendChild(checkbox);
    }
    else if (settingParam.type === 'Select') {
      const select = document.createElement('select');
      select.id = kebabStorageKey;
      select.className = 'input-row__select';

      for (const selectItem of settingParam.selectItems!) {
        // <select>内の各<option>を生成して格納
        const option = document.createElement('option');
        option.textContent = selectItem.label;
        option.setAttribute('value', selectItem.storageValue);

        // ストレージに設定された値と等しければ選択状態にする
        if (selectItem.storageValue === settedValue) {
          option.selected = true;
        }

        select.appendChild(option);
      }

      // 選択変更時の設定値保存イベントの設定
      select.addEventListener('change', async () => {
        await chrome.storage.sync.set({ [storageKey]: select.value });
      });

      settingInput.appendChild(select);
    }

    settingInput.prepend(label);
    settingList!.appendChild(settingInput);
  }

  // HACK: 直後にtransitionをオンにするとアニメーションしてしまうので、少し間を置く
  const checkboxes = document.querySelectorAll('.input-row input[type="checkbox"]');
  setTimeout(() => {
    for (const checkbox of checkboxes) {
      checkbox.parentElement!.className = 'checkbox checkbox-initialized';
    }
  }, 50);
});
