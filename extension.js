const vscode = require('vscode');
const { init, showInput } = require('./src');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('进制转换插件启动~');
	context.subscriptions.push(init());
	const disposable = vscode.commands.registerCommand('baseConvert.convert', function () {
		showInput();
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
