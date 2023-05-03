const target = document.getElementById('file_list');
const obsConfig = {
  childList: true,
  characterData: false,
  subtree: false,
};
const observer = new MutationObserver((mutationsList) => {
  console.log('DOM Updated');
  console.log(mutationsList);

  for (mutation of mutationsList) {
    mutation.addedNodes.forEach((uploadFileArea) => {
      const button = document.createElement('button');
      button.textContent = 'パスワード自動設定';
      uploadFileArea.getElementsByClassName('dlkey')[0].appendChild(button);
    });
  };
});

// #file_listを監視
observer.observe(target, obsConfig);
