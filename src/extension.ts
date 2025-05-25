import * as vscode from "vscode";
import { CurrentLocale } from "./core/locale/locale";
import { SyncTask } from "./features/sync_task/sync_task_command";
import { RunOnCurrentFile } from "./features/run_on_current_file/run_on_current_file_command";
import { EnterTokenCommand } from "./features/enter_token/enter_token_command";
import { MyInputViewProvider } from "./features/panel/panel_provider";

export let currentLocale = new CurrentLocale("");

export function activate(context: vscode.ExtensionContext) {
  currentLocale = new CurrentLocale(vscode.env.language);

  // context.subscriptions.push(
  //   vscode.window.registerTreeDataProvider("myView", new MyInputViewProvider(context))
  // );
  const provider = new MyInputViewProvider(context);

  // Регистрируем вебвью в боковой панели с id "myInputView"
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "myExtension.myInputView",
      provider
    )
  );
  [new EnterTokenCommand(), new RunOnCurrentFile(), new SyncTask()].forEach(
    (command) =>
      context.subscriptions.push(
        vscode.commands.registerCommand(command.registerCommand, () =>
          command.command(context)
        )
      )
  );
}

export function deactivate() {}
