let checkboxEnable: HTMLInputElement;

window.addEventListener('load', () => {
  const checkboxEnable: HTMLInputElement = document.getElementById('enable') as HTMLInputElement;
  chrome.storage.sync.get(['isEnable'], (result) => {
    checkboxEnable.checked = result.isEnable;
  });

  checkboxEnable.addEventListener('change', async (e) => {
    await chrome.storage.sync.set({
      isEnable: (e.target as HTMLInputElement).checked
    });
  })
});
