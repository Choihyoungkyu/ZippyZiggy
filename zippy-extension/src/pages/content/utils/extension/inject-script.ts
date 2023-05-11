const injectScript = () => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('src/pages/inject/index.js');
  script.type = 'module';
  script.defer = true;

  script.onload = () => {
    script.remove();
  };

  (document.head || document.documentElement).appendChild(script);
};

export default injectScript;
