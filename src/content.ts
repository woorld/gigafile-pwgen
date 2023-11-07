import { randChar, pwLength, uploadCompleteStr, copiedMessage } from './constants';

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
  const isCopyToClipboard = (await chrome.storage.sync.get('isCopyToClipboard'))['isCopyToClipboard'];
  if (!isCopyToClipboard) {
    return;
  }

  try {
    await navigator.clipboard.writeText(copyText);
  }
  catch (e) {
    alert('クリップボードへのコピーに失敗しました: ' + e);
  }
};

const showCopiedTooltip = (targetElement: HTMLElement): void => {
  // すでにツールチップが表示されている場合は削除
  const oldTooltips = document.getElementsByClassName('pwgen-tooltip');
  if (oldTooltips.length >= 1) {
    for (const tooltip of oldTooltips) {
      tooltip.remove();
    }
  }

  document.body.insertAdjacentHTML('beforeend', `
    <div class="pwgen-tooltip">
      <p class="pwgen-tooltip__content">${copiedMessage}</p>
    </div>
  `);

  const tooltip = document.getElementsByClassName('pwgen-tooltip')[0] as HTMLElement;
  const targetRect = targetElement.getBoundingClientRect();
  const tooltipRect = tooltip!.getBoundingClientRect();

  // 対象要素の2px上にツールチップの底辺が来るように調整
  tooltip!.style.top = `${targetRect.top - tooltipRect.height - 2}px`;
  tooltip!.style.left = `${targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)}px`;

  const removeTooltip = () => {
    window.removeEventListener('scroll', removeTooltip);
    if (!document.body.contains(tooltip)) {
      return;
    }

    tooltip!.style.opacity = '0';
    // HACK: アニメーション完了を待って要素を削除する
    setTimeout(() => { tooltip!.remove(); }, 400);
  };

  // 画面スクロールまたは表示後10秒経過でツールチップ削除
  window.addEventListener('scroll', removeTooltip);
  setTimeout(removeTooltip, 1000 * 10);

  // 要素追加後にopacityを1にすることでアニメーションして表示させようとするが、直後にアラートが出るためいきなり出るように見える
  tooltip!.style.opacity = '1';
};

type ToastType = 'Update' | 'Copied';
const showToast = (type: ToastType) => {
  const toastList = document.getElementById('pwgen-toast-list');
  if (!toastList) {
    return;
  }

  const toastClass = type === 'Update' ? 'update' : 'copied';
  const toastContent = type === 'Update'
    ? `
      <p>ギガファイル便DLパスジェネレーターがアップデートされました！</p>
      <p>詳しくは<a href="https://github.com/woorld/gigafile-pwgen/releases/" target="_blank" rel="noopener">こちら</a>をご覧ください。</p>
    `
    : `<p>${copiedMessage}</p>`;

  toastList.insertAdjacentHTML('beforeend', `
    <li class="pwgen-toast pwgen-toast--${toastClass}">
      <img class="pwgen-toast__icon">
      <div class="pwgen-toast__content">${toastContent}</div>
      <div class="pwgen-toast__close-btn-area"></div>
    </li>
  `);
  const toast = toastList.lastElementChild as HTMLElement;

  // CSSでは画像のパスを設定できないためこちらで設定する
  const toastIcon = toast!.getElementsByClassName('pwgen-toast__icon')[0];
  toastIcon!.setAttribute('src', chrome.runtime.getURL('img/icon/icon128.png'));

  const removeToast = () => {
    if (!document.body.contains(toast)) {
      return;
    }

    toast!.style.opacity = '0';
    // HACK: アニメーション完了を待って要素を削除する
    setTimeout(() => { toast!.remove(); }, 400);
  };
  const toastCloseBtn = toast!.getElementsByClassName('pwgen-toast__close-btn-area')[0];

  // ×ボタン押下または表示後10秒経過でトースト削除
  toastCloseBtn.addEventListener('click', () => { removeToast(); });
  if (type === 'Copied') {
    setTimeout(removeToast, 1000 * 10);
  }

  // 要素追加後にopacityを1にすることでアニメーションして表示させようとするが、直後にアラートが出るためいきなり出るように見える
  toast!.style.opacity = '1';
};

chrome.storage.sync.get(['isEnable'], (result) => {
  if (!result.isEnable) {
    return;
  }

  // トースト用のリストを作成
  const toastList = document.createElement('ul');
  toastList.id = 'pwgen-toast-list';
  document.body.appendChild(toastList);

  chrome.storage.sync.get(['isUpdate'], (result) => {
    if (!result.isUpdate) {
      return;
    }

    // アップデート直後の場合はトーストで通知する
    showToast('Update');
    chrome.storage.sync.set({ isUpdate: false });
  });

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

      // TODO: 設定によってだし分け
      showToast('Copied');
      showCopiedTooltip(buttonPackUpWithPw);

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

          // TODO: 設定によってだし分け
          showToast('Copied');
          showCopiedTooltip(button);
        });

        uploadFileArea.getElementsByClassName('dlkey')[0].appendChild(button);
      });
    };
  });

  // #file_listを監視
  observer.observe(target, obsConfig);
});
