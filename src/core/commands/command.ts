import * as vscode from 'vscode';
export abstract class Command {
    abstract registerCommand: string;
    abstract command(context: vscode.ExtensionContext): Promise<void>;
}