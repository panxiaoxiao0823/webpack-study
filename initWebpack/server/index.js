if (typeof window === 'undefined') {
  global.window = {};
}

const fs = require('fs');
const path = require('path');
const express = require('express');
const { renderToString } = require('react-dom/server')
const SSR = require('../dist/search-server') // 要渲染的组件模块:search
const template = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8') // 当前html页面返回内容，采用这种方式好处：可以正常加载css
const data = require('./data.json') // mock后端接口返回数据

const server = (port) => {
  const app = express();


  app.use(express.static('dist'));
  app.get('/search', (req, res) => {
    const html = renderMarkup(renderToString(SSR))
    res.status(200).send(html)
  })


  app.listen(port, () => {
    console.log('Server is running on port:' + port);
  })
}


server(process.env.PORT || 8999);

const renderMarkup = (str) => {
  const dataStr = JSON.stringify(data);
  // <!--HTML_PLACEHOLDER-->是利用注释写的占位符，替换成当前search组件
  // <!--INITIAL_DATA_PLACEHOLDER-->是利用注释写的占位符，后端接口返回数据挂载到window.__initial_data对象上，前端拿着window.__initial_data进行数据处理
  return template.replace('<!--HTML_PLACEHOLDER-->', str).replace('<!--INITIAL_DATA_PLACEHOLDER-->', `<script>winodw.__initial_data=${dataStr}</script>`)
}