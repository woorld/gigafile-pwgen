import type { SettingParam } from './types';
import type { INotyfOptions, INotyfNotificationOptions } from 'notyf';

export const randChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const pwLength = 4;
export const copiedMessage = 'DLパス・URLをコピーしました！';
export const copyFailedMessage = 'クリップボードへのコピーに失敗しました。';
export const copiedMessageShowMs = 5000;
export const settingParams: SettingParam[] = [
  {
    storageKey: 'isEnable',
    label: '有効',
    type: 'Toggle',
    requireReload: true,
    defaultValue: true,
  },
  {
    storageKey: 'isCopyToClipboard',
    label: 'DLパス・URLのコピー',
    type: 'Toggle',
    defaultValue: true,
  },
  // TODO: DLパスのコピーがオフの場合はグレーアウトして無効化する
  {
    storageKey: 'copiedNoticeType',
    label: 'コピー通知の方法',
    type: 'Select',
    defaultValue: 'tooltip',
    selectItems: [
      {
        label: 'ボタン上に表示',
        storageValue: 'tooltip',
      },
      {
        label: '画面上に表示',
        storageValue: 'toast',
      },
      {
        label: '両方',
        storageValue: 'both',
      },
      {
        label: 'なし',
        storageValue: 'none',
      },
    ],
  },
  {
    storageKey: 'isOptimizeLayout',
    label: 'レイアウトの最適化',
    type: 'Toggle',
    requireReload: true,
    defaultValue: true,
  },
];

export const notyfOption: Partial<INotyfOptions> = {
  // トーストの共通設定
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
};

export const updateToastOption: Partial<INotyfNotificationOptions> = {
  type: 'info',
  message: `
    <p>ギガファイル便DLパスジェネレーターがアップデートされました！</p>
    <p>詳しくは<a href="https://github.com/woorld/gigafile-pwgen/releases/" target="_blank" rel="noopener">こちら</a>をご覧ください。</p>
  `,
};

export const copyToastOption: Partial<INotyfNotificationOptions> = {
  type: 'success',
  message: copiedMessage,
};
