// 登陆

var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var ApiFactory = require('./../../cmp/ApiFactory.js');
var Fetch = require('./../../fetch/fetch.js');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
var Toast = AntdMobile.Toast;
var Cordova = require('./../../cordova/cordova_main.js');
var PotoCmp = require('./../common/PotoCmp/PotoCmp.js');


module.exports = React.createClass({
    selectedPoto: function(imgs) {
        alert(JSON.stringify(imgs));
    },
    componentDidMount: function() {
        // 初始化cordova
        Cordova.init(function() {

        	// alert('cordova初始化成功')

        });
    },
    render: function() {
        return (
            <div className="text-center">
                登录
                <PotoCmp callback={this.selectedPoto.bind(this)}/>
            </div>
        );
    }
});
