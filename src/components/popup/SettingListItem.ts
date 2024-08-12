import van from 'vanjs-core';
import type { SettingParam } from '../../constants';
import { toKebabCase } from '../../util';
import { SettingListItemInput } from './SettingListItemInput';

const { label, span, li } = van.tags;

export const SettingListItem = async (param: SettingParam) => {
  // TODO: クラス名をコンポーネント名に合わせて改修
  const settingLabel = label({ for: toKebabCase(param.storageKey) }, param.label);

  if (param.requireReload) {
    const mark = span({ class: 'require-reload-mark' });
    van.add(settingLabel, mark);
  }

  return li(
    { class: 'input-row' },
    settingLabel,
    await SettingListItemInput(param),
  );
};
