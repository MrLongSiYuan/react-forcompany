// 慢病病历--医生端&患者端 自定义的可折叠容器

var React = require('react');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var Accordion = AntdMobile.Accordion;
var List = AntdMobile.List;


module.exports = React.createClass({

    getInitialState: function () {
        return {
            isShow: true
        };
    },

    componentDidMount: function() {
        this.onChangeStatus();
    },

    // 展开收起切换
    onChangeStatus: function() {
        this.setState({
            isShow: !this.state.isShow
        });
    },

    // 渲染列表
    renderList: function (header, list, children) {
        return (
            <Accordion defaultActiveKey="0" openAnimation={{}} onChange={this.onChangeStatus}>
                <Accordion.Panel key="0" header={header}>
                    <List>
                        {
                            list.length > 0 &&
                            list.map(function (item, index) {
                                return (
                                    <List.Item>
                                        {children(item, index, this.props.option)}
                                    </List.Item>
                                );
                            }.bind(this))
                        }
                    </List>
                </Accordion.Panel>
            </Accordion>
        );
    },

    // 渲染底部内容
    renderFooter: function (footer) {
        return (
            <div style={{background: '#fff', padding: '.15rem .3rem', borderBottom: '1px solid #ddd'}}>
                {footer}
            </div>
        );
    },

    render: function() {
        var header = this.props.header;
        var footer = this.props.footer;
        var list = this.props.list;
        var children = this.props.children;

        var display = list.length == 0 || this.state.isShow ? this.renderFooter(footer) : '';
        return (
            <div className="accordion-container" style={{ marginTop: 10, marginBottom: 10 }}>
                {this.renderList(header, list, children)}
                {display}
            </div>
        );
    }
});
