import {} from 'typed-query-selector';
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
    uploadFileArea.querySelector('input.dlkey_inp')!.value = pw;
    uploadFileArea.querySelector('button.set_dlkey.gfbtn')!.click();

    const dlUrl = uploadFileArea.querySelector('input.file_info_url.url')!.value;
    const copyText = `${dlUrl}\nダウンロードパスワード：${pw}`;

    await copyToClipboard(copyText, pwGenerateButton);
  });

  return pwGenerateButton;
};
