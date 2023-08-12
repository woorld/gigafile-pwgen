export const randChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const pwLength = 4;
export const uploadCompleteStr = '完了！';

export type settingParam = {
  storageKey: string,
  label: string,
};

// export const settingParams: Readonly<{ isEnable: settingParam, isCopyToClipboard: settingParam}> = Object.freeze({
//   isEnable: {
//     storageKey: 'isEnable',
//     label: '有効',
//   },
//   isCopyToClipboard: {
//     storageKey: 'isCopyToClipboard',
//     label: 'DLパス・URLのコピー',
//   },
// });

export const settingParams = new Map<string, settingParam>([
  ['isEnable', {
    storageKey: 'isEnable',
    label: '有効',
  }],
  ['isCopyToClipboard', {
    storageKey: 'isCopyToClipboard',
    label: 'DLパス・URLのコピー',
  }],
]);
