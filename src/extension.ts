import * as vscode from "vscode";
import { CurrentLocale } from "./core/locale/locale";
import { SyncTask } from "./features/sync_task/sync_task_comand";
import { RunOnCurrentFile } from "./features/run_on_current_file/run_on_current_file_comand";
import { EnterTokenCommand } from "./features/enter_token/enter_token_comand";

export let currentLocale = new CurrentLocale("");

export function activate(context: vscode.ExtensionContext) {
  currentLocale = new CurrentLocale(vscode.env.language);
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
