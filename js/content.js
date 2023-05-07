const randChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const pwLength = 4;
const generatePw = () => {
  return Array.from(crypto.getRandomValues(new Uint32Array(pwLength))).map((n) => randChar[n % randChar.length]).join('');
};

const copyComputedCssText = (target, ignoreProps) => {
  // スタイルの取得
  const ignorePropName = ignoreProps !== undefined
    ? new RegExp(`^(${ignoreProps.join('|')})$`)
    : '';
  const targetStyle = getComputedStyle(target);
  let computedCssText = '';

  // 取得したスタイルから必要なスタイルのみを抽出しCSSTextを組み立て
  for (let i = 0; i < targetStyle.length; i++) {
    const propName = targetStyle.item(i);
    const propVal = targetStyle.getPropertyValue(propName);

    if ((ignorePropName !== '' && ignorePropName.test(propName)) || propVal === '') {
      continue;
    }

    computedCssText += `${propName}: ${propVal};`;
  }

  return computedCssText;
}

chrome.storage.sync.get(['isEnable'], (result) => {
  if (!result.isEnable) {
    return;
  }

  // 「まとめる」ボタンの横に「パスワード付きでまとめる」ボタンを追加
  const buttonPackUp = document.getElementById('matomete_btn');
  const buttonPackUpWithPw = document.createElement('button');

  // 「まとめる」ボタンに合わせてspanでボタン内テキストを作成し追加
  const buttonText = document.createElement('span');
  buttonText.textContent = 'パスワード付きでまとめる';

  const buttonCssText = copyComputedCssText(buttonPackUp, ['width', 'inline-size', 'padding']) + 'padding: 5px;';
  buttonPackUpWithPw.style.cssText = buttonCssText;
  buttonPackUpWithPw.appendChild(buttonText);

  buttonPackUpWithPw.addEventListener('click', async () => {
    // TODO: ファイルが選択されていない、または1つでもアップロード未完了の場合は中断する処理
    const pw = generatePw();
    const obsConfig = {
      attributes: true,
    };
    const obsPackUp = new MutationObserver(async (mutationsList) => {
      // TODO: 値がギガファイル便URLであることのチェック
      const dlUrl = mutationsList[0].target.attributes[4].value;
      const copyText = `${dlUrl}\nダウンロードパスワード：${pw}`;

      try {
        await navigator.clipboard.writeText(copyText);
      }
      catch (e) {
        alert('クリップボードへのコピーに失敗しました: ' + e);
      }

      obsPackUp.disconnect();
    });

    obsPackUp.observe(document.getElementById('matomete_url'), obsConfig);

    // パスを入力して設定ボタンを押下
    document.getElementById('zip_dlkey').value = pw;
    buttonPackUp.click();
  });

  buttonPackUp.parentNode.appendChild(buttonPackUpWithPw);

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
        button.style.cssText = copyComputedCssText(document.getElementsByClassName('set_dlkey')[0], ['width', 'inline-size']);

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
