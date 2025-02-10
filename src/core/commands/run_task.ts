import { ExtensionContext } from "vscode";
import { Command } from "./command";
import * as path from "path";
import * as vscode from "vscode";

export class RunTask extends Command {
  registerCommand: string = "learn_lambda.runTask";
  async command(_: ExtensionContext): Promise<void> {
    const filePath = path.join(
      vscode.workspace.workspaceFolders?.at(0)?.uri?.path ?? "",
      "/task.ts"
    );

    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(filePath),
      Buffer.from(`const p = 1;
const fp = 2;

console.log(p + fp) `, "utf-8")
    );

    await vscode.window.showTextDocument(await vscode.workspace.openTextDocument(
      vscode.Uri.file(filePath)
    ));
    vscode.window.showInformationMessage(`Файл создан: ${filePath})`);
    vscode.workspace.onDidChangeTextDocument(event => {
      event.document.getText();
    });
  }
}
