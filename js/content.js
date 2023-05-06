const randChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const pwLength = 4;
const generatePw = () => {
  return Array.from(crypto.getRandomValues(new Uint32Array(pwLength))).map((n) => randChar[n % randChar.length]).join('');
};

const copyComputedCssText = (target) => {
  // スタイルの取得
  const ignorePropName = /\d{1,}|width/;
  const targetStyle = getComputedStyle(target);
  let computedCssText = '';

  // 取得したスタイルから必要なスタイルのみを抽出
  for (const prop in targetStyle) {
    const propVal = targetStyle.getPropertyValue(prop);
    if (ignorePropName.test(prop) || propVal === '') {
      console.log(prop, targetStyle.getPropertyValue(prop), false);
      continue;
    }
    console.log(prop, targetStyle.getPropertyValue(prop), true);
    computedCssText += `${prop}: ${propVal};`;
  }

  return computedCssText;
}

chrome.storage.sync.get(['isEnable'], (result) => {
  if (!result.isEnable) {
    return;
  }

  const target = document.getElementById('file_list');
  const obsConfig = {
    childList: true,
    characterData: false,
    subtree: false,
  };
  const observer = new MutationObserver((mutationsList) => {
    for (mutation of mutationsList) {
      mutation.addedNodes.forEach((uploadFileArea) => {
        const button = document.createElement('button');

        button.textContent = 'PW生成・設定';
        button.style.cssText = copyComputedCssText(document.getElementsByClassName('set_dlkey')[0]);

        button.addEventListener('click', async () => {
          const pw = generatePw();
          // パスを入力して設定ボタンを押下
          uploadFileArea.getElementsByClassName('dlkey_inp')[0].value = pw;
          uploadFileArea.getElementsByClassName('set_dlkey gfbtn')[0].click();

          const dlUrl = uploadFileArea.getElementsByClassName('file_info_url url')[0].value;
          const copyText = `${dlUrl}\nダウンロードパスワード：${pw}`;

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
});
