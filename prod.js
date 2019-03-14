/** 用于开发环境的服务启动 **/
var compression = require('compression');
const path = require("path");			// 获取绝对路径有用
const express = require("express");		// express服务器端框架
const app = express();                      // 实例化express服务
const PORT = 8902;                          // 服务启动端口号

app.use(compression());//开启gzip
app.use(express.static('build/'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/', 'index.html'));
});

/** 启动服务，监听PORT端口 **/
app.listen(PORT, () => {
    console.log('服务已启动: http://localhost:%s', PORT);
});