// 慢病病历--医生端&患者端 展示空数据组件

var React = require('react');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var Button = AntdMobile.Button;


module.exports = React.createClass({

    render: function() {
        return (
            this.props.type ?
                <div style={{background: '#fff', padding: '0.15rem 0.3rem', borderBottom: '1px solid #ddd'}}>
                    <div style={{textAlign: 'center', fontSize: '15px'}}>暂无数据</div>
                </div>
                :
                <div style={{textAlign: 'center', fontSize: '15px'}}>暂无数据</div>
        );
    }
});
