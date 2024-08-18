import van from 'vanjs-core';
import { isUploadedFile, generatePw, copyToClipboard } from '../../util';

const { button, span } = van.tags;

export const PackUpWithPwButton = (cssText: string, packUpButton: HTMLElement): HTMLButtonElement => {
  const packUpWithPwButton = button(
    {
      class: 'pwgen-packup-with-pw',
      style: cssText,
    },
    span('パスワード付きでまとめる'),
  );

  packUpWithPwButton.addEventListener('click', async () => {
    const files = document.getElementsByClassName('file_info')!;
    let existsUploadedFile = false;
    let existsUploadPausingFile = false;

    if (files.length <= 0) {
      alert('ファイルを選択してください。');
      return;
    }

    for (const file of files) {
      const buttonCancelStatus = file.getElementsByClassName('cancel')[0].getAttribute('value');

      // アップロード完了済ファイル・中断中ファイルはスキップ
      if (isUploadedFile(file)) {
        existsUploadedFile = true;
        continue;
      }
      if (buttonCancelStatus === 'on') {
        existsUploadPausingFile = true;
        continue;
      }

      alert('アップロードが完了していないファイルがあります。\n完了してから再度お試しください。');
      return;
    }

    // アップロード完了済ファイルがない（中断中ファイルしかない）場合はエラーになるため処理を抜ける
    if (!existsUploadedFile) {
      alert('全ファイルのアップロードが中断されています。\nいずれかのファイルのアップロードを再開し、アップロード完了後に再度お試しください。');
      return;
    }

    if (existsUploadPausingFile) {
      alert('アップロード未完了かつ中断中のファイルはまとめられません。\n次に表示されるアラートでは全ファイルをまとめた旨が通知されますが、実際にはアップロード済みのファイル（アップロード完了後に中断したものを含む）のみがまとめられていますのでご注意ください。');
    }

    const pw: string = generatePw();
    const obsConfig = {
      attributes: true,
    };
    const obsPackUp = new MutationObserver(async (mutationsList) => {
      const dlUrl = (mutationsList[0].target as HTMLInputElement).attributes[4].value;
      const copyText = `${dlUrl}\nダウンロードパスワード：${pw}`;

      await copyToClipboard(copyText, packUpWithPwButton);

      obsPackUp.disconnect();
    });

    obsPackUp.observe(document.getElementById('matomete_url')!, obsConfig);

    // パスを入力して設定ボタンを押下
    (document.getElementById('zip_dlkey') as HTMLInputElement).value = pw;
    packUpButton.click();
  });

  return packUpWithPwButton;
};
