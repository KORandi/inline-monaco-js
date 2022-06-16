javascript: (async function () {
  const scriptPromise = (src) =>
    new Promise((resolve, reject) => {
      const script = document.createElement("script");
      document.body.appendChild(script);
      script.onload = resolve;
      script.onerror = reject;
      script.async = true;
      script.src = src;
    });

  const main = async () => {
    await scriptPromise(
      "https://unpkg.com/monaco-editor@latest/min/vs/loader.js"
    );

    require.config({
      paths: { vs: "https://unpkg.com/monaco-editor@latest/min/vs" },
    });
    window.MonacoEnvironment = {
      getWorkerUrl: function (workerId, label) {
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = {
              baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
            };
            importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');`)}`;
      },
    };

    require(["vs/editor/editor.main"], function () {
      const textAreas = document.querySelectorAll("textarea");
      Array.from(textAreas).forEach((textArea) => {
        const value = textArea.value;
        const newNode = document.createElement("div");
        newNode.style.minHeight = "300px";
        newNode.style.width = "100%";
        textArea.parentNode.insertBefore(newNode, textArea);
        textArea.style.display = "none";
        const editor = monaco.editor.create(newNode, {
          value: value,
          language: "html",
          theme: "vs-dark",
        });
        editor.onDidChangeModelContent(function (e) {
          textArea.value = editor.getValue();
        });
      });
    });
  };

  await main();
})();
