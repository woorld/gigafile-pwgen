import van from 'vanjs-core';
import { generatePw, copyToClipboard, isUploadedFile } from '../../utils/util';

const { button } = van.tags;

export const PwGenerateButton = (cssText: string, uploadFileArea: Element): HTMLButtonElement => {
  const pwGenerateButton = button({ style: cssText }, 'PW生成・設定');

  pwGenerateButton.addEventListener('click', async () => {
    if (!isUploadedFile(uploadFileArea)) {
      alert('ファイルのアップロードが完了していません。\n完了してから再度お試しください。');
      return;
    }

    const pw = generatePw();
    // パスを入力して設定ボタンを押下
    (uploadFileArea.getElementsByClassName('dlkey_inp')[0] as HTMLInputElement).value = pw;
    (uploadFileArea.getElementsByClassName('set_dlkey gfbtn')[0] as HTMLElement).click();

    const dlUrl = (uploadFileArea.getElementsByClassName('file_info_url url')[0] as HTMLInputElement).value;
    const copyText = `${dlUrl}\nダウンロードパスワード：${pw}`;

    await copyToClipboard(copyText, pwGenerateButton);
  });

  return pwGenerateButton;
};
