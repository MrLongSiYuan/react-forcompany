// 预约--医生端&患者端 自定义的保存Button组件

var React = require('react');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var Button = AntdMobile.Button;


module.exports = React.createClass({

    // 保存按钮事件
    save: function () {
        if (this.props.onSave) {
            this.props.onSave();
        }
    },

    render: function() {
        var isClick = this.props.isClick;
        var content = this.props.content;
        return (
            <div className="set-btn-color" style={{margin: '20px'}}>
                <Button
                    activeStyle={{opacity: 0.8}}
                    style={{height: '0.9rem'}}
                    loading={!!isClick}
                    className="btn" type="primary"
                    onClick={this.save.bind(this)}
                >
                    {content || '保存'}
                </Button>
            </div>
        );
    }
});
