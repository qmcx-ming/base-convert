const vscode = require('vscode');

const reg = /^(0[bB][01]+)|(0[oO][0-7]+)|(0[xX][0-9a-fA-F]+)|(\d+(\.\d+)?)$/;

function init() {
  return vscode.languages.registerHoverProvider('*', {
    provideHover(document, position, token) {
      const word = document.getText(document.getWordRangeAtPosition(position));
      // 属于进制数再显示
      if (reg.test(word)) {
        const fromBase = detectBase(word);// 检测进制
        // 去除进制前缀
        const number = word.replace(/^(0[bBxXoO])?/, '');
        const hex = convertBase(number, fromBase, 16);
        const dec = convertBase(number, fromBase, 10);
        const oct = convertBase(number, fromBase, 8);
        const bin = convertBase(number, fromBase, 2);
        const hoverContent = new vscode.MarkdownString(
          `**进制转换**\n` +
          `- HEX(十六进制): ${hex} [复制](command:baseConvert.copyTextCommand?${encodeURIComponent(JSON.stringify(hex))})\n` +
          `- DEC(十进制): ${dec} [复制](command:baseConvert.copyTextCommand?${encodeURIComponent(JSON.stringify(dec))})\n` +
          `- OCT(八进制): ${oct} [复制](command:baseConvert.copyTextCommand?${encodeURIComponent(JSON.stringify(oct))})\n` +
          // 对于二进制每4位中间加一个空格 如： 1010 1011
          `- BIN(二进制): ${bin.replace(/(.{4})/g, '$1 ')} [复制](command:baseConvert.copyTextCommand?${encodeURIComponent(JSON.stringify(bin))})`
        );
        hoverContent.isTrusted = true;// 允许链接命令执行
        return new vscode.Hover(hoverContent);
      }
    }
  })
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
  // 如果目标进制是二进制，并且结果长度不足8位，补充0
  if (toBase === 2 && result.length === 5) {
    result = result.padStart(8, '0');
  }
  return result;
}

module.exports = {
  init
}