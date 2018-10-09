// 慢病病历--医生端&患者端 AccordionContainer头部Button组件

var React = require('react');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var Button = AntdMobile.Button;


module.exports = React.createClass({

    // 保存按钮事件
    handle: function (event) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        if (this.props.onClick) {
            this.props.onClick();
        }
    },

    render: function() {
        var styles = this.props.styles;
        var orderId = localStorage.getItem('orderId') || '';
        var noEdit = localStorage.getItem('noEdit') || '';
        return (
            !noEdit && <span
                style={{
                    color: styles && styles.color || '#fff',
                    background:  styles && styles.background || '#5dd974',
                    borderRadius: '100px',
                    padding: '3px 8px',
                    marginLeft: '10px',
                    fontSize: '15px'
                }}
                onClick={this.handle.bind(this)}
            >{this.props.content}</span>
        );
    }
});
