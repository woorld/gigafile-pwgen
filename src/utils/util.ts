import {
  pwLength,
  randChar,
  copiedMessage,
  copyFailedMessage,
  copiedMessageShowMs,
  notyfOption,
  updateToastOption,
  copyToastOption
} from './constants';
import { Notyf } from 'notyf';
import tippy from 'tippy.js';
import type { ToastType } from './types';

const notyf = new Notyf(notyfOption);

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

const showCopiedNotice = async (tooltipTargetElement: HTMLElement): Promise<void> => {
  const copiedNoticeType = (await chrome.storage.sync.get('copiedNoticeType'))['copiedNoticeType'];
  switch (copiedNoticeType) {
    // 'none'の場合は何もしない
    case 'tooltip':
      showCopiedTooltip(tooltipTargetElement);
      return;
    case 'toast':
      showToast('Copied');
      return;
    case 'both':
      showCopiedTooltip(tooltipTargetElement);
      showToast('Copied');
      return;
  }
};

// NOTE: 数字が1単語とみなされてしまうため、必要に応じて修正
export const camelToKebab = (str: string): string => {
  return str.replace(/[A-Z0-9]/g, repstr => '-' + repstr.toLowerCase());
};

export const generatePw = (): string => {
  return Array.from(crypto.getRandomValues(new Uint32Array(pwLength))).map((n) => randChar[n % randChar.length]).join('');
};

export const copyComputedCssText = (target: Element | null, ignoreProps: Array<string>): string => {
  if (target == null) {
    // TODO: ちゃんとしたエラー処理
    alert('エラーが発生しました。CSS抽出対象がnullです。');
    return '';
  }

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

export const showToast = (toastType: ToastType): void => {
  if (toastType === 'Update') {
    notyf.open(updateToastOption);
    return;
  }
  notyf.open(copyToastOption);
};

export const copyToClipboard = async (copyText: string, tooltipTargetElement: HTMLElement): Promise<void> => {
  const isCopyToClipboard = (await chrome.storage.sync.get('isCopyToClipboard'))['isCopyToClipboard'];
  if (!isCopyToClipboard) {
    return;
  }

  try {
    await navigator.clipboard.writeText(copyText);
    showCopiedNotice(tooltipTargetElement);
  }
  catch (e) {
    alert(`${copyFailedMessage}\n${e}`);
  }
};

export const isUploadedFile = (uploadFileArea: Element): boolean => {
  return uploadFileArea.querySelector<HTMLInputElement>('.file_info_url.url')!.value !== '';
};
