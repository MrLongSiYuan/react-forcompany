// 医生端--显示0计数功能的Textarea组件

var React = require('react');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var TextareaItem = AntdMobile.TextareaItem;


module.exports = React.createClass({

    getInitialState: function() {
        return {
            content: this.props.content || '',
        };
    },

    // 处理TextareaItem输入
    handleChange: function (value) {
        this.setState({
            content: value
        });
        this.props.onChangeContent(value);
    },

    render: function() {
        return (
            <div style={{
                padding: '10px 15px',
                marginTop: '10px',
                background: '#fff',
                position: 'relative'
            }}>
                <TextareaItem
                    onChange={this.handleChange.bind(this)}
                    value={this.state.content}
                    style={{width: '100%', padding: 0}}
                    rows={this.props.rows || "6"}
                    count={this.props.count || 400}
                    placeholder={this.props.placeholder}
                />
                {
                    !this.state.content.length &&
                    <span style={{
                        position: 'absolute',
                        right: '1.15rem',
                        bottom: '0.1rem',
                        fontSize: '0.26rem'
                    }}>{this.state.content.length}</span>
                }
            </div>
        );
    }
});
