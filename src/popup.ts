import { settingParams } from './constants';

const toKebabCase = (str: string) => str.replace(/[A-Z0-9]/g, repstr => '-' + repstr.toLowerCase());
const toCamelCase = (str: string) => str.replace(/-[a-z0-9]/g, str => str.slice(1).toUpperCase());

window.addEventListener('load', async () => {
  const settingList = document.getElementById('setting-list');

  // @ts-ignore
  for (const [key, param] of settingParams) {
    const kebabStorageKey = toKebabCase(param.storageKey);

    const settingInput = document.createElement('li');
    settingInput.className = 'input-row';

    const label = document.createElement('label');
    label.setAttribute('for', kebabStorageKey);

    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox';

    const checkboxInput = document.createElement('input');
    checkboxInput.setAttribute('type', 'checkbox');
    checkboxInput.id = kebabStorageKey;

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
