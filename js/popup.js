let checkboxEnable;

window.addEventListener('load', () => {
  checkboxEnable = document.getElementById('enable');
  chrome.storage.sync.get(['isEnable'], (result) => {
    checkboxEnable.checked = result.isEnable;
  });

  checkboxEnable.addEventListener('change', async (e) => {
    await chrome.storage.sync.set({
      isEnable: e.target.checked
    });
  })
});
