# 进制转换悬浮提示插件

## 简介

插件市场：[Base Convert - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=qmcx.base-convert)

GitHub：[qmcx-ming/base-convert: 这是一个vscode的进制转换悬浮提示插件 (github.com)](https://github.com/qmcx-ming/base-convert)

这是一个进制转换的悬浮提示插件，将鼠标悬停在数字上，便会弹出悬浮框显示该数字的十六进制、十进制、八进制和二进制数值。

## 使用说明

### 1、悬浮进制转换提示

![](https://s21.ax1x.com/2024/08/20/pAP5jB9.png)

### 2、命令面板调用进制转换

使用快捷键 `Ctrl` + `Shift` + `P`，调出命令面板，输入`bc`、`进制`或者`Base Convert`，回车。

![image-20240824223621237](https://s21.ax1x.com/2024/08/24/pAFgIMj.png)

输入需要转换的数字。

![image-20240824223844567](https://s21.ax1x.com/2024/08/24/pAF2Sy9.png)

此处存在**空值校验**以及**数字格式校验**

- 十六进制：需要0x(或0X)开头的数字
- 十进制：一个普通的数字
- 八进制：需要0o(或0O)开头的数字
- 二进制：需要0b(或者0B)开头的数字

![image-20240824223959188](https://s21.ax1x.com/2024/08/24/pAF2pLR.png)

按上下键可以选择转换后的进制数据，按下回车后，实现复制功能，选择了**返回**选项，则会回到上一个输入框中，可以重新输入数字。

![image-20240824224339762](https://s21.ax1x.com/2024/08/24/pAF2Ce1.png)
