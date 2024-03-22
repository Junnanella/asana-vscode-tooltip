// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "asana" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("asana.helloWorld", () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage("Hello World from Asana!");
  });

  const regex = /https?:\/\/app\.asana\.com\/0\/[0-9]+\/([0-9]+)(\/f)?/i;

  const getAsanaTaskId = (text: string): string => {
    // Format 1: https://app.asana.com/0/1150527741687836123213/1206911076351813
    // Format 2: https://app.asana.com/0/1150527741687836/1206911076351813/f

    const match = text.match(regex);

    if (!match) {
      // This should never happen because this is only called if
      // the hover provider detects a regex match
      throw new Error("Unexpected invalid Asana URL");
    }

    return match[1];
  };

  const hoverProvider: vscode.HoverProvider = {
    // TODO: Support multiple URLs in one line later
    provideHover(document, position, token) {
      const line = document.lineAt(position.line);
      const match = line.text.match(regex);

      // Link doesn't even appear in the line
      if (!match) {
        return;
      }

      const asanaLinkIndex = line.text.indexOf(match[0]);
      const lengthOfAsanaLink = match[0].length;

      // Link does appear, but I'm not hovering over it
      if (position.character < asanaLinkIndex || position.character > asanaLinkIndex + lengthOfAsanaLink) {
        return;
      }

      const taskId = getAsanaTaskId(line.text);

      return new vscode.Hover(`The Asana Task ID is ${taskId}`);
    },
  };

  const disposableHoverProvider = vscode.languages.registerHoverProvider(
    { scheme: "file" },
    hoverProvider
  );

  context.subscriptions.push(disposable, disposableHoverProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
