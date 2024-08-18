import van from 'vanjs-core';
import type { SettingParam } from '../../types';
import { toKebabCase } from '../../util';
import { SettingListItemInput } from './SettingListItemInput';

const { label, span, li } = van.tags;

export const SettingListItem = async (param: SettingParam): Promise<HTMLLIElement> => {
  const settingLabel = label({ for: toKebabCase(param.storageKey) }, param.label);

  if (param.requireReload) {
    const mark = span({ class: 'require-reload-mark' });
    van.add(settingLabel, mark);
  }

  return li(
    { class: 'setting-list-item' },
    settingLabel,
    await SettingListItemInput(param),
  );
};
