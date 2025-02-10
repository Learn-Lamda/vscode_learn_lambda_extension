import * as vscode from "vscode";
import { CurrentLocale } from "./core/locale/locale";
import { EnterTokenCommand } from "./core/commands/enter_token";
import { RunTask } from "./core/commands/run_task";
import { SyncTask } from "./core/commands/sync_task";
export let currentLocale = new CurrentLocale("");

export function activate(context: vscode.ExtensionContext) {
  currentLocale = new CurrentLocale(vscode.env.language);
  [new EnterTokenCommand(), new RunTask(), new SyncTask()].forEach((command) =>
    context.subscriptions.push(
      vscode.commands.registerCommand(command.registerCommand, () =>
        command.command(context)
      )
    )
  );
}

export function deactivate() {}
