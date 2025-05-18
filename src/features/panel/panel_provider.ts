import * as vscode from "vscode";

export class MyInputViewProvider implements vscode.WebviewViewProvider {

  constructor(private readonly _context: vscode.ExtensionContext) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true
    };

    webviewView.webview.html = this.getHtmlForWebview();

    // Обработка сообщений из Webview
    webviewView.webview.onDidReceiveMessage(message => {
      switch(message.command) {
        case 'submit':
          vscode.window.showInformationMessage(`Вы ввели: ${message.text}`);
          break;
      }
    });
  }

  private getHtmlForWebview() {
    return `
      <!DOCTYPE html>
      <html lang="ru">
      <body>
        <input type="text" id="inputBox" placeholder="Введите текст" />
        <button onclick="submit()">Отправить</button>

        <script>
          const vscode = acquireVsCodeApi();
          function submit() {
            const input = document.getElementById('inputBox').value;
            vscode.postMessage({ command: 'submit', text: input });
          }
        </script>
      </body>
      </html>
    `;
  }
}