const vscode = require('vscode');

const reg = /^(0[bB][01]+)|(0[oO][0-7]+)|(0[xX][0-9a-fA-F]+)|(\d+(\.\d+)?)$/;

function init() {
  return vscode.languages.registerHoverProvider('*', {
    provideHover(document, position, token) {
      const word = document.getText(document.getWordRangeAtPosition(position));
      // 属于进制数再显示
      if (reg.test(word)) {
        const { hex, dec, oct, bin, binSpace } = getBaseNumber(word);
        const hoverContent = new vscode.MarkdownString(
          `**进制转换**\n` +
          `- HEX(十六进制): ${hex} [复制](command:baseConvert.copyTextCommand?${encodeURIComponent(JSON.stringify(hex))})\n` +
          `- DEC(十进制): ${dec} [复制](command:baseConvert.copyTextCommand?${encodeURIComponent(JSON.stringify(dec))})\n` +
          `- OCT(八进制): ${oct} [复制](command:baseConvert.copyTextCommand?${encodeURIComponent(JSON.stringify(oct))})\n` +
          // 对于二进制每4位中间加一个空格 如： 1010 1011
          `- BIN(二进制): ${binSpace} [复制](command:baseConvert.copyTextCommand?${encodeURIComponent(JSON.stringify(bin))})`
        );
        hoverContent.isTrusted = true;// 允许链接命令执行
        return new vscode.Hover(hoverContent);
      }
    }
  })
}

function showQuickPick(value) {
  const { hex, dec, oct, bin, binSpace } = getBaseNumber(value);
  vscode.window.showQuickPick([
    { label: hex, description: 'HEX(十六进制)', detail: 'Binary', value: hex },
    { label: dec, description: 'DEC(十进制)', detail: 'Octal', value: dec },
    { label: oct, description: 'OCT(八进制)', detail: 'Decimal', value: oct },
    { label: binSpace, description: 'BIN(二进制)', detail: 'Hexadecimal', value: bin },
    { label: '返回', detail: 'Return', value: 'return' }
  ], {
    ignoreFocusOut: true
  }).then((selection) => {
    if (selection) {
      const { value } = selection;
      value === 'return' ? showInput() : vscode.commands.executeCommand('baseConvert.copyTextCommand', value);
    }
  })
}

function showInput() {
  vscode.window.showInputBox({
    prompt: '请输入要转换的数字',
    placeHolder: '例如: 0b1010、10...',
    // 编辑器失去焦点，输入框不会自动关闭
    ignoreFocusOut: true,
    validateInput: (value) => {
      if (!value) {
        return '请输入要转换的数字';
      }
      if (!reg.test(value)) {
        return '请输入正确的数字格式【十六进制(0x开头数字(0-9,a-f,A-F)、八进制(0o开头数字(0-7))、十进制(数字)、二进制(0b开头数字(0-1))】';
      }
    }
  }).then((value) => {
    if (value) {
      showQuickPick(value);
    }
  })
}

// 获取每个进制数
function getBaseNumber(value) {
  const fromBase = detectBase(value);// 检测进制
  // 去除进制前缀
  const number = value.replace(/^(0[bBxXoO])?/, '');
  const hex = convertBase(number, fromBase, 16);
  const dec = convertBase(number, fromBase, 10);
  const oct = convertBase(number, fromBase, 8);
  const bin = convertBase(number, fromBase, 2);
  return { hex, dec, oct, bin, binSpace: bin.replace(/(.{4})/g, '$1 ') };
}

// 判断是否为进制数
function detectBase(value) {
  if (value.startsWith('0b') || value.startsWith('0B')) {
    return 2; // 二进制
  } else if (value.startsWith('0o') || value.startsWith('0O')) {
    return 8; // 八进制
  } else if (value.startsWith('0x') || value.startsWith('0X')) {
    return 16; // 十六进制
  } else if (/^[0-9]+$/.test(value)) {
    return 10; // 十进制，没有前缀的数字
  } else {
    throw new Error('无法识别的进制或无效的数字');
  }
}

// 进制转换
function convertBase(value, fromBase, toBase) {
  // 将输入的数字字符串从原始进制转换为十进制整数
  const decimalValue = parseInt(value, fromBase);
  // 将十进制整数转换为目标进制的字符串
  let result = decimalValue.toString(toBase).toUpperCase(); // 将结果转换为大写（适用于16进制表示）
  // 如果目标进制是二进制，检查长度并按需补零
  if (toBase === 2) {
    const length = result.length;
    const remainder = length % 4;

    // 如果二进制结果的长度不是4的倍数，补充0
    if (remainder !== 0) {
      result = result.padStart(length + (4 - remainder), '0');
    }
  }
  return result;
}

module.exports = {
  init,
  showInput
}