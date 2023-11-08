// TODO: exportまみれなのどうにかしたい
export const randChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const pwLength = 4;
export const uploadCompleteStr = '完了！';
export const copiedMessage = 'DLパス・URLをコピーしました！';
export const copiedMessageShowMs = 5000;

export type StorageKey = 'isEnable' | 'isCopyToClipboard' | 'copiedNoticeType';
export type SettingType = 'Toggle' | 'Select';
export type SelectItem = {
  label: string,
  storageValue: string,
};
export type SettingParam = {
  storageKey: StorageKey,
  label: string,
  type: SettingType,
  // TODO: typeがSelectの場合はdefaultValueにstorageValueの値のみが入るようにする
  defaultValue: boolean | string;
  selectItems?: SelectItem[],
};

export const settingParams: SettingParam[] = [
  {
    storageKey: 'isEnable',
    label: '有効',
    type: 'Toggle',
    defaultValue: true,
  },
  {
    storageKey: 'isCopyToClipboard',
    label: 'DLパス・URLのコピー',
    type: 'Toggle',
    defaultValue: true,
  },
  // TODO: コピー通知がオフの場合はグレーアウトして無効化する
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
];
