import { ExtensionContext } from "vscode";
import { Command } from "../../core/commands/command";

export class SyncTask extends Command{
    registerCommand: string = 'learn_lambda.SyncTask';
    command(context: ExtensionContext): Promise<void> {
        throw new Error("Method not implemented.");
    }

}