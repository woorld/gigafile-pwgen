export const randChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const pwLength = 4;
export const uploadCompleteStr = '完了！';
export const copiedMessage = 'DLパス・URLをコピーしました！';

export type SettingParam = {
  storageKey: string,
  label: string,
};

export const settingParams: SettingParam[] = [
  {
    storageKey: 'isEnable',
    label: '有効',
  },
  {
    storageKey: 'isCopyToClipboard',
    label: 'DLパス・URLのコピー',
  },
];
