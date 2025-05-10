import { Command } from "./command";
import * as path from "path";
import {
  ExtensionContext,
  Position,
  Range,
  TextEditor,
  TextEditorDecorationType,
  Uri,
  window,
  workspace,
} from "vscode";
import { HttpRepository } from "../repository/http_repository";
type Statuses = 'ok' | 'error' | 'nocode';

export interface Lines {
  line: number;
  status: Statuses;
  out?: {
    log: string;
    line: number;
  };
}

export class RunTask extends Command {
  httpRepository: HttpRepository = new HttpRepository();
  registerCommand: string = "learn_lambda.runTask";
  async command(context: ExtensionContext): Promise<void> {
    const filePath = path.join(
      workspace.workspaceFolders?.at(0)?.uri?.path ?? "",
      "/task.ts"
    );

    await workspace.fs.writeFile(
      Uri.file(filePath),
      Buffer.from(
        `const p = 1;
const fp = 2;

console.log(p + fp);
console.log(p + fp); 
console.log(p + fp);



`,
        "utf-8"
      )
    );

    await window.showTextDocument(
      await workspace.openTextDocument(Uri.file(filePath))
    );
    window.showInformationMessage(`Файл создан: ${filePath})`);

    // workspace.onDidChangeTextDocument(async (event) => {
    //   console.log(JSON.stringify({
    //     "code": event.document.getText(),
    //     "token": "123",
    //     "taskId": "3123"
    //   }));

    (await this.httpRepository.runVm(window.activeTextEditor?.document.getText() ?? "")).map(
      (vmValue) => {
        console.log(JSON.stringify(vmValue));
        let activeEditor = window.activeTextEditor as TextEditor;

        const sucessRanges: Range[] = [];
        const falseRanges: Range[] = [];
        const noCodeRanges: Range[] = [];
        vmValue.value.forEach((el) => {
          const l = el.line - 1;
          const range = new Range(new Position(l, 0), new Position(l, 0));
          if (el.status === 'ok') {
            sucessRanges.push(range);
          } else if (el.status === 'error') {
            falseRanges.push(range);
          } else if (el.status === 'nocode') {
            noCodeRanges.push(range);
          }
        });
        activeEditor.setDecorations(
          window.createTextEditorDecorationType({
            gutterIconPath: Uri.file(
              path.join(context.extensionPath, "image", "green_point.svg")
            ),
            gutterIconSize: "contain",
          }),
          sucessRanges
        );
        activeEditor.setDecorations(
          window.createTextEditorDecorationType({
            gutterIconPath: Uri.file(
              path.join(context.extensionPath, "image", "red_point.svg")
            ),
            gutterIconSize: "contain",

          }),
          falseRanges
        );
        activeEditor.setDecorations(
          window.createTextEditorDecorationType({
            gutterIconPath: Uri.file(
              path.join(context.extensionPath, "image", "white_point.svg")
            ),
            gutterIconSize: "contain",
          }),
          sucessRanges
        );
      }
    );
    // const lines: Lines[] = [{ "line": 1, "success": true }, { "line": 2, "success": true }, { "line": 3, "success": true }, { "line": 4, "success": true }, { line: 5, success: false }];
    // });
  }
}
