export type StorageKey = 'isEnable' | 'isCopyToClipboard' | 'copiedNoticeType' | 'isOptimizeLayout';

export type SettingType = 'Toggle' | 'Select';

export type ToastType = 'Update' | 'Copied';

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
  requireReload?: boolean,
  selectItems?: SelectItem[],
};

// event.targetの型付け用
export interface HTMLEvent<T extends EventTarget> extends Event {
  target: T;
}
