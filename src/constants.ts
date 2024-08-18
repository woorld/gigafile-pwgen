import type { SettingParam } from './types';

export const randChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const pwLength = 4;
export const copiedMessage = 'DLパス・URLをコピーしました！';
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
