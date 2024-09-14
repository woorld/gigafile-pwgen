import { copyComputedCssText, showToast } from './utils/util';
import { PwGenerateButton } from './components/content/PwGenerateButton';
import { PackUpWithPwButton } from './components/content/PackUpWithPwButton';
import 'notyf/notyf.min.css';
import 'tippy.js/dist/tippy.css';

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
  const packUpButton: HTMLElement = document.getElementById('matomete_btn')!;
  let packUpButtonCssText: string = copyComputedCssText(packUpButton, ['width', 'inline-size', 'padding']) + 'padding: 5px;';
  if (navigator.userAgent.match(/Mobile/)) {
    packUpButtonCssText += 'width:100%;';
  }

  const packUpWithPwButton = PackUpWithPwButton(packUpButtonCssText, packUpButton);
  packUpButton.parentNode!.appendChild(packUpWithPwButton);

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

        const pwGenerateButtonCssText = copyComputedCssText(document.getElementsByClassName('set_dlkey')[0] as HTMLButtonElement, ['width', 'inline-size']);
        const pwGenerateButton = PwGenerateButton(pwGenerateButtonCssText, uploadFileArea);

        uploadFileArea.getElementsByClassName('dlkey')[0].appendChild(pwGenerateButton);
      });
    };
  });

  // #file_listを監視
  observer.observe(target, obsConfig);
});
