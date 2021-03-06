// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var socket_debugger = require("./IDE/socket-debugger.js");
var workspace_helper = require("./IDE/workspace-helper.js");


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    workspace_helper.setContext(context);

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    //console.log('Congratulations, your extension "c4-earth" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable;

    disposable = vscode.commands.registerCommand('extension.c4earth_init', workspace_helper.initWorkspace);
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.c4earth_initForce', workspace_helper.initWorkspaceForce);
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.c4earth_new', workspace_helper.newFile);
    context.subscriptions.push(disposable);
    
    disposable = vscode.commands.registerTextEditorCommand('extension.c4earth_call', socket_debugger.call);
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerTextEditorCommand('extension.c4earth_run', socket_debugger.run);
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.c4earth_findserver', socket_debugger.findserver);
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.c4earth_abort', socket_debugger.abort);
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.c4earth_reset', socket_debugger.reset);
    context.subscriptions.push(disposable);
}
exports.activate = activate;


// this method is called when your extension is deactivated
function deactivate() {
      
}
exports.deactivate = deactivate;