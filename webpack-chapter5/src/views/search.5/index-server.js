// import React from "react";
// import ReactDom from "react-dom";
// import "./search.less";
// import ImgShow from '../../assets/images/1.jpeg'
// import '../../common/common';
// // ES Module
// import resLargeNumber from 'res-large-number'
// // CJS
// // const resLargeNumber = require('res-large-number')
// // AMD
// // require(['res-large-number'], function (resLargeNumber) {
// //   largeNum  = resLargeNumber('999999999', '1');
// //   console.log('largeNum==>', largeNum);
// // })

const React = require("react")
const ReactDom = require("react-dom")
const ImgShow = require('../../assets/images/1.jpeg')
require('../../common/common')
require("./search.less")
const resLargeNumber = require('res-large-number')

class Search extends React.Component {

  constructor() {
    super(...arguments)

    this.state = {
      Text: null
    }
  }

  loadText() {
    import('./text').then(Text => {
      this.setState({
        Text: Text.default
      })
    })
  }

  render() {
    let Text = this.state.Text;
    let largeNum = resLargeNumber('999999999', '1');
    return (
      <div className="search-box">
        搜索的内容：
        <input type="text"></input>
        <br />
        展示图片：
        <img className="search-img" onClick={this.loadText.bind(this)} src={ ImgShow } />
        <br />
        <p>My name is：007</p>
        {Text ? <div>动态加载Text组件：{<Text />}</div> : null}
        <p>大整数加法插件结果：999999999 + 1 = {largeNum}</p>
      </div>
    );
  }
}

// ReactDom.render(<Search />, document.getElementById("root"));
module.exports = <Search />;

