chrome.storage.sync.get(['isEnable'], (result) => {
  if (!result.isEnable) {
    return;
  }

  const randChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const passLength = 4;
  const target = document.getElementById('file_list');
  const obsConfig = {
    childList: true,
    characterData: false,
    subtree: false,
  };
  const observer = new MutationObserver((mutationsList) => {
    // 設定ボタンのスタイルの取得
    const ignorePropName = /\d{1,}|width/;
    const buttonStyle = getComputedStyle(document.getElementsByClassName('set_dlkey')[0]);
    let newButtonStyle = '';

    // 取得した設定ボタンのスタイルから必要なスタイルのみを抽出
    for (const prop in buttonStyle) {
      const propVal = buttonStyle.getPropertyValue(prop);
      if (ignorePropName.test(prop) || propVal === '') {
        continue;
      }
      newButtonStyle += `${prop}: ${propVal};`;
    }

    for (mutation of mutationsList) {
      mutation.addedNodes.forEach((uploadFileArea) => {
        const button = document.createElement('button');

        button.textContent = 'PW生成・設定';
        button.style.cssText = newButtonStyle;

        button.addEventListener('click', async () => {
          const pass = generatePass();
          // パスを入力して設定ボタンを押下
          uploadFileArea.getElementsByClassName('dlkey_inp')[0].value = pass;
          uploadFileArea.getElementsByClassName('set_dlkey gfbtn')[0].click();

          const dlUrl = uploadFileArea.getElementsByClassName('file_info_url url')[0].value;
          const copyText = `${dlUrl}\nダウンロードパスワード：${pass}`;

          try {
            await navigator.clipboard.writeText(copyText);
          }
          catch (e) {
            alert('クリップボードへのコピーに失敗しました: ' + e);
          }
        });

        uploadFileArea.getElementsByClassName('dlkey')[0].appendChild(button);
      });
    };
  });

  // #file_listを監視
  observer.observe(target, obsConfig);

  const generatePass = () => {
    return Array.from(crypto.getRandomValues(new Uint32Array(passLength))).map((n) => randChar[n % randChar.length]).join('');
  };
});
