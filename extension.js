const vscode = require('vscode');
const { init } = require('./src');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('原神启动~');
	context.subscriptions.push(init());
	const disposable = vscode.commands.registerCommand('baseConvert.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from base-convert!');
	});

	context.subscriptions.push(disposable);

	const copyTextCommand = vscode.commands.registerCommand('baseConvert.copyTextCommand', (text) => {
		vscode.env.clipboard.writeText(text).then(() => {
			vscode.window.showInformationMessage(`复制到剪贴板: ${text}`);
		});
	});
	context.subscriptions.push(copyTextCommand);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
