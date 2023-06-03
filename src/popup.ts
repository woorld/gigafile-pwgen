window.addEventListener('load', () => {
  const checkboxEnable = document.getElementById('enable') as HTMLInputElement;
  chrome.storage.sync.get(['isEnable'], (result) => {
    checkboxEnable.checked = result.isEnable;

    // ポップアップ表示時にアニメーションするのを防ぐため、transitionを後付けする
    // HACK: 直後にtransitionをオンにするとアニメーションしてしまうので、少し間を置く
    setTimeout(() => {
      document.getElementsByClassName('checkbox')[0].className = 'checkbox checkbox-initialized';
    }, 50);
  });

  checkboxEnable.addEventListener('change', async (e) => {
    await chrome.storage.sync.set({
      isEnable: (e.target as HTMLInputElement).checked
    });
  })
});
