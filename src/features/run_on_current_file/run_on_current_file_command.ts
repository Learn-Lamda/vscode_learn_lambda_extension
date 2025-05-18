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
import { Command } from "../../core/commands/command";
import { RunOnCurrentFileHttpRepository } from "./run_on_current_file_http_repository";

export class RunOnCurrentFile extends Command {
  httpRepository: RunOnCurrentFileHttpRepository =
    new RunOnCurrentFileHttpRepository();
  registerCommand: string = "learn_lambda.runOnCurrentFile";
  async command(context: ExtensionContext): Promise<void> {
    const editor = window.activeTextEditor;
    if (!editor) {
      return;
    }
    const decoration: {
      decoration: TextEditorDecorationType;
      range: Range[];
      log?: string;
    }[] = [];
    const outLogRanges: {
      range: Range;
      log: String;
      decoration: TextEditorDecorationType;
    }[] = [];

    workspace.onDidChangeTextDocument(async (event) => {
      (
        await this.httpRepository.runVm(
          window.activeTextEditor?.document.getText() ?? ""
        )
      ).map((vmValue) => {
        decoration.forEach((el) => el.decoration.dispose());
        outLogRanges.forEach((el) => el.decoration.dispose());
        let activeEditor = window.activeTextEditor as TextEditor;

        const sucessRanges: Range[] = [];
        const falseRanges: Range[] = [];
        const notExecutedRanges: Range[] = [];
        vmValue.value.forEach((el) => {
          const l = el.line - 1;

          const range = new Range(new Position(l, 0), new Position(l, 0));
          if (el.status === "success") {
            sucessRanges.push(range);
          } else if (el.status === "error") {
            falseRanges.push(range);
          } else if (el.status === "not_execute") {
            notExecutedRanges.push(range);
          }
          if (el?.logs !== null) {
            outLogRanges.push({
              range: new Range(
                new Position(0, 0),
                new Position(
                  el.line - 1,
                  editor.document.lineAt(el.line - 1).text.length
                )
              ),
              log: el.logs,
              decoration: window.createTextEditorDecorationType({
                after: {
                  contentText: String(el.logs),
                  color: "hsla(175, 89.70%, 54.10%, 0.70)",
                  margin: "0 0 0 10px",
                },
              }),
            });
          }
        });

        decoration.push({
          decoration: window.createTextEditorDecorationType({
            gutterIconPath: Uri.file(
              path.join(context.extensionPath, "image", "green_point.svg")
            ),
            gutterIconSize: "contain",
          }),
          range: sucessRanges,
        });
        decoration.push({
          decoration: window.createTextEditorDecorationType({
            gutterIconPath: Uri.file(
              path.join(context.extensionPath, "image", "white_point.svg")
            ),
            gutterIconSize: "contain",
          }),
          range: notExecutedRanges,
        });
        decoration.push({
          decoration: window.createTextEditorDecorationType({
            gutterIconPath: Uri.file(
              path.join(context.extensionPath, "image", "red_point.svg")
            ),
            gutterIconSize: "contain",
          }),
          range: falseRanges,
        });

        decoration.forEach((el) =>
          activeEditor.setDecorations(el.decoration, el.range)
        );
        outLogRanges.forEach((el) =>
          activeEditor.setDecorations(el.decoration, [el.range])
        );
      });
    });
  }
}
