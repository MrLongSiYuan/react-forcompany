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

    // 展开收起切换
    onChangeStatus: function() {
        this.setState({
            isShow: !this.state.isShow
        });
    },

    render: function() {
        var header = this.props.header;
        var footer = this.props.footer;
        return (
            <div className="accordion-container">
                <Accordion openAnimation={{}} onChange={this.onChangeStatus}>
                    <Accordion.Panel key="0" header={header}>
                        <List>
                            {this.props.children}
                        </List>
                    </Accordion.Panel>
                </Accordion>
                {
                    this.state.isShow &&
                    <div style={{background: '#fff', padding: '.15rem .3rem', borderBottom: '1px solid #ddd'}}>
                        {footer}
                    </div>
                }
            </div>
        );
    }
});
