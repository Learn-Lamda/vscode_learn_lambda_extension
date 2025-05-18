import { Command } from "../../core/commands/command";
import { currentLocale } from "../../extension";
 import * as vscode from 'vscode';

export class EnterTokenCommand extends Command {
    registerCommand: string = 'learn_lambda.enterToken';
    async command(context: vscode.ExtensionContext): Promise<void> {
        const userInput = await vscode.window.showInputBox({ prompt: currentLocale.locale.writeToken() });
        if (userInput) {
            vscode.window.showInformationMessage(`Вы ввели: ${userInput}`);
            context.globalState.update('savedString', userInput);
        } else {
            vscode.window.showErrorMessage("");
        }
    }
}