import van from 'vanjs-core';

const { ul } = van.tags;

export const SettingList = (): HTMLUListElement => ul({
  class: 'setting-list',
});
