import { randChar, pwLength, uploadCompleteStr } from './constants';

const generatePw = (): string => {
  return Array.from(crypto.getRandomValues(new Uint32Array(pwLength))).map((n) => randChar[n % randChar.length]).join('');
};

const copyComputedCssText = (target: HTMLElement, ignoreProps: Array<string>): string => {
  // スタイルの取得
  const ignorePropName: RegExp | string = ignoreProps !== undefined
    ? new RegExp(`^(${ignoreProps.join('|')})$`)
    : '';
  const targetStyle: CSSStyleDeclaration = getComputedStyle(target);
  let computedCssText: string = '';

  // 取得したスタイルから必要なスタイルのみを抽出しCSSTextを組み立て
  for (let i = 0; i < targetStyle.length; i++) {
    const propName: string = targetStyle.item(i);
    const propVal: string = targetStyle.getPropertyValue(propName);

    if ((ignorePropName !== '' && (ignorePropName as RegExp).test(propName)) || propVal === '') {
      continue;
    }

    computedCssText += `${propName}: ${propVal};`;
  }

  return computedCssText;
}

const copyToClipboard = async (copyText: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(copyText);
  }
  catch (e) {
    alert('クリップボードへのコピーに失敗しました: ' + e);
  }
};

chrome.storage.sync.get(['isEnable'], (result) => {
  if (!result.isEnable) {
    return;
  }

  // 「まとめる」ボタンの横に「パスワード付きでまとめる」ボタンを追加
  const buttonPackUp: HTMLElement = document.getElementById('matomete_btn')!;
  const buttonPackUpWithPw = document.createElement('button');

  // 「まとめる」ボタンに合わせてspanでボタン内テキストを作成し追加
  const buttonText: HTMLElement = document.createElement('span');
  buttonText.textContent = 'パスワード付きでまとめる';

  const buttonCssText: string = copyComputedCssText(buttonPackUp, ['width', 'inline-size', 'padding']) + 'padding: 5px;';
  buttonPackUpWithPw.style.cssText = buttonCssText;
  buttonPackUpWithPw.appendChild(buttonText);

  buttonPackUpWithPw.addEventListener('click', async () => {
    const files = document.getElementsByClassName('file_info')!;

    if (files.length <= 0) {
      alert('ファイルを選択してください。');
      return;
    }

    for (const file of files) {
      const uploadStatus = file.getElementsByClassName('status')[0].textContent;
      const buttonCancelStatus = file.getElementsByClassName('cancel')[0].getAttribute('value');

      if (uploadStatus === uploadCompleteStr || buttonCancelStatus === 'on') {
        continue;
      }
      alert('アップロードが完了していないファイルがあります。\n完了してから再度お試しください。');
      return;
    }

    const pw: string = generatePw();
    const obsConfig = {
      attributes: true,
    };
    const obsPackUp = new MutationObserver(async (mutationsList) => {
      const dlUrl = (mutationsList[0].target as HTMLInputElement).attributes[4].value;
      const copyText = `${dlUrl}\nダウンロードパスワード：${pw}`;

      await copyToClipboard(copyText);
      obsPackUp.disconnect();
    });

    obsPackUp.observe(document.getElementById('matomete_url')!, obsConfig);

    // パスを入力して設定ボタンを押下
    (document.getElementById('zip_dlkey') as HTMLInputElement).value = pw;
    buttonPackUp.click();
  });

  buttonPackUp.parentNode!.appendChild(buttonPackUpWithPw);

  const target = document.getElementById('file_list')!;
  const obsConfig = {
    childList: true,
    characterData: false,
    subtree: false,
  };
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      mutation.addedNodes.forEach((uploadFileArea) => {
        if (!(uploadFileArea instanceof Element)) {
          return;
        }

        const button = document.createElement('button');

        button.textContent = 'PW生成・設定';
        button.style.cssText = copyComputedCssText(document.getElementsByClassName('set_dlkey')[0] as HTMLButtonElement, ['width', 'inline-size']);

        button.addEventListener('click', async () => {
          const uploadStatus = uploadFileArea.getElementsByClassName('status')[0].textContent;
          if (uploadStatus !== uploadCompleteStr) {
            alert('ファイルのアップロードが完了していません。\n完了してから再度お試しください。');
            return;
          }

          const pw = generatePw();
          // パスを入力して設定ボタンを押下
          (uploadFileArea.getElementsByClassName('dlkey_inp')[0] as HTMLInputElement).value = pw;
          (uploadFileArea.getElementsByClassName('set_dlkey gfbtn')[0] as HTMLElement).click();

          const dlUrl = (uploadFileArea.getElementsByClassName('file_info_url url')[0] as HTMLInputElement).value;
          const copyText = `${dlUrl}\nダウンロードパスワード：${pw}`;

          await copyToClipboard(copyText);
        });

        uploadFileArea.getElementsByClassName('dlkey')[0].appendChild(button);
      });
    };
  });

  // #file_listを監視
  observer.observe(target, obsConfig);
});
