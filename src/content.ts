import { randChar, pwLength, copiedMessage, copiedMessageShowMs } from './constants';
import { Notyf } from 'notyf';
import tippy from 'tippy.js';
import 'notyf/notyf.min.css';
import 'tippy.js/dist/tippy.css';

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
  let hideTimerId: number | null = null;
  const tippyInstance = tippy(targetElement, {
    content: copiedMessage,
    trigger: 'manual',
    // デフォルトだとmargin-top分上に表示されるためoffsetでその分を下げる
    offset: [0, -(Number(targetElement.style.marginTop))],
    onShown() {
      hideTimerId = window.setTimeout(() => { tippyInstance.hide(); }, copiedMessageShowMs);
    },
    onHidden() {
      if (hideTimerId !== null) {
        window.clearTimeout(hideTimerId);
      }
      tippyInstance.destroy();
    },
  });

  tippyInstance.show();
};

type ToastType = 'Update' | 'Copied';
const notyf = new Notyf({
  // 共通設定
  ripple: false,
  position: {
    x: 'center',
    y: 'top',
  },
  dismissible: true,
  types: [
    {
      type: 'info',
      duration: 0, // 自動で閉じない
      background: '#5888e0',
      icon: {
        className: 'pwgen-toast__icon',
        tagName: 'div',
      },
      className: 'pwgen-toast',
    },
    {
      type: 'success',
      duration: copiedMessageShowMs,
      className: 'pwgen-toast',
    },
  ],
});

const showToast = (toastType: ToastType): void => {
  if (toastType === 'Update') {
    notyf.open({
      type: 'info',
      message: `
        <p>ギガファイル便DLパスジェネレーターがアップデートされました！</p>
        <p>詳しくは<a href="https://github.com/woorld/gigafile-pwgen/releases/" target="_blank" rel="noopener">こちら</a>をご覧ください。</p>
      `,
    });
    return;
  }
  notyf.open({
    type: 'success',
    message: copiedMessage,
  });
};

const isUploadedFile = (uploadFileArea: Element): boolean => uploadFileArea.querySelector<HTMLInputElement>('.file_info_url.url')!.value !== '';

const showCopiedNotice = async (targetElement: HTMLElement): Promise<void> => {
  const copiedNoticeType = (await chrome.storage.sync.get('copiedNoticeType'))['copiedNoticeType'];
  switch (copiedNoticeType) {
    // 'none'の場合は何もしない
    case 'tooltip':
      showCopiedTooltip(targetElement);
      return;
    case 'toast':
      showToast('Copied');
      return;
    case 'both':
      showCopiedTooltip(targetElement);
      showToast('Copied');
      return;
  }
};

chrome.storage.sync.get(['isEnable'], (result) => {
  if (!result.isEnable) {
    return;
  }

  chrome.storage.sync.get(['isUpdate'], (result) => {
    if (!result.isUpdate) {
      return;
    }

    // アップデート直後の場合はトーストで通知する
    showToast('Update');
    chrome.storage.sync.set({ isUpdate: false });
  });

  chrome.storage.sync.get(['isOptimizeLayout'], (result) => {
    if (!result.isOptimizeLayout) {
      return;
    }

    // 操作領域の親要素にレイアウト変更用クラスを付与
    const controlWrapper = document.getElementById('file_list');
    if (controlWrapper === null) {
      return;
    }

    controlWrapper.classList.add('pwgen-optimized-layout');
  });

  // 「まとめる」ボタンの横に「パスワード付きでまとめる」ボタンを追加
  const buttonPackUp: HTMLElement = document.getElementById('matomete_btn')!;
  const buttonPackUpWithPw = document.createElement('button');

  // 「まとめる」ボタンに合わせてspanでボタン内テキストを作成し追加
  const buttonText: HTMLElement = document.createElement('span');
  buttonText.textContent = 'パスワード付きでまとめる';

  let buttonCssText: string = copyComputedCssText(buttonPackUp, ['width', 'inline-size', 'padding']) + 'padding: 5px;';
  if (navigator.userAgent.match(/Mobile/)) {
    buttonCssText += 'width:100%;';
  }

  buttonPackUpWithPw.style.cssText = buttonCssText;
  buttonPackUpWithPw.className = 'pwgen-packup-with-pw';
  buttonPackUpWithPw.appendChild(buttonText);

  buttonPackUpWithPw.addEventListener('click', async () => {
    const files = document.getElementsByClassName('file_info')!;
    let existsUploadedFile = false;
    let existsUploadPausingFile = false;

    if (files.length <= 0) {
      alert('ファイルを選択してください。');
      return;
    }

    for (const file of files) {
      const buttonCancelStatus = file.getElementsByClassName('cancel')[0].getAttribute('value');

      // アップロード完了済ファイル・中断中ファイルはスキップ
      if (isUploadedFile(file)) {
        existsUploadedFile = true;
        continue;
      }
      if (buttonCancelStatus === 'on') {
        existsUploadPausingFile = true;
        continue;
      }

      alert('アップロードが完了していないファイルがあります。\n完了してから再度お試しください。');
      return;
    }

    // アップロード完了済ファイルがない（中断中ファイルしかない）場合はエラーになるため処理を抜ける
    if (!existsUploadedFile) {
      alert('全ファイルのアップロードが中断されています。\nいずれかのファイルのアップロードを再開し、アップロード完了後に再度お試しください。');
      return;
    }

    if (existsUploadPausingFile) {
      alert('アップロード未完了かつ中断中のファイルはまとめられません。\n次に表示されるアラートでは全ファイルをまとめた旨が通知されますが、実際にはアップロード済みのファイル（アップロード完了後に中断したものを含む）のみがまとめられていますのでご注意ください。');
    }

    const pw: string = generatePw();
    const obsConfig = {
      attributes: true,
    };
    const obsPackUp = new MutationObserver(async (mutationsList) => {
      const dlUrl = (mutationsList[0].target as HTMLInputElement).attributes[4].value;
      const copyText = `${dlUrl}\nダウンロードパスワード：${pw}`;

      await copyToClipboard(copyText);

      showCopiedNotice(buttonPackUpWithPw);

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
          if (!isUploadedFile(uploadFileArea)) {
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

          showCopiedNotice(button);
        });

        uploadFileArea.getElementsByClassName('dlkey')[0].appendChild(button);
      });
    };
  });

  // #file_listを監視
  observer.observe(target, obsConfig);
});
