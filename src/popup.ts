import { settingParams } from './constants';

const toKebabCase = (str: string) => str.replace(/[A-Z0-9]/g, repstr => '-' + repstr.toLowerCase());
const toCamelCase = (str: string) => str.replace(/-[a-z0-9]/g, str => str.slice(1).toUpperCase());

window.addEventListener('load', async () => {
  const settingList = document.getElementById('setting-list');

  // 設定項目リストから設定画面を生成して#setting-listに格納
  for (const settingParam of settingParams) {
    const kebabStorageKey = toKebabCase(settingParam.storageKey);

    // 設定項目の<li>
    const settingInput = document.createElement('li');
    settingInput.className = 'input-row';

    // 項目名のラベル
    const label = document.createElement('label');
    label.setAttribute('for', kebabStorageKey);
    label.textContent = settingParam.label;

    // 項目のオンオフスイッチラッパー
    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox';

    // 項目のオンオフスイッチ本体
    const checkboxInput = document.createElement('input');
    checkboxInput.setAttribute('type', 'checkbox');
    checkboxInput.id = kebabStorageKey;

    // 項目のオンオフスイッチの装飾用<label>
    const checkboxLabel = document.createElement('label');
    checkboxLabel.className = 'checkbox__switch';
    checkboxLabel.setAttribute('for', kebabStorageKey);

    checkbox.appendChild(checkboxInput);
    checkbox.appendChild(checkboxLabel);

    settingInput.appendChild(label);
    settingInput.appendChild(checkbox);

    settingList!.appendChild(settingInput);
  }
  const checkboxes = document.querySelectorAll('.input-row input[type="checkbox"]');

  await chrome.storage.sync.get(null, (result) => {
    for (const checkbox of checkboxes) {
      const storageValName = toCamelCase(checkbox.id);

      // 各チェックボックスのオンオフを設定値と同期させる
      (checkbox as HTMLInputElement).checked = result[storageValName];

      checkbox.addEventListener('change', async (e) => {
        await chrome.storage.sync.set({ [storageValName]: (e.target as HTMLInputElement).checked })
      });
    }
  });

  // HACK: 直後にtransitionをオンにするとアニメーションしてしまうので、少し間を置く
  setTimeout(() => {
    for (const checkbox of checkboxes) {
      checkbox.parentElement!.className = 'checkbox checkbox-initialized';
    }
  }, 50);
});
