window.addEventListener('load', async () => {
  const checkboxes = document.querySelectorAll('.input-row input[type="checkbox"]');

  await chrome.storage.sync.get(null, (result) => {
    for (const checkbox of checkboxes) {
      const storageValName = checkbox.id.replace(/-[a-z0-9]/g, str => str.slice(1).toUpperCase());

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
