// 患者 & 医生端--选择检查项

var React = require('react');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var ApiFactory = require('./../../../../cmp/ApiFactory.js');
var Fetch = require('./../../../../fetch/fetch.js');
var List = AntdMobile.List;
var Toast = AntdMobile.Toast;
var Popup = AntdMobile.Popup;


module.exports = React.createClass({

    getInitialState: function () {
        return {
            allItems: [],       // 所有检查项
            childItems: [],       // popup内子检查项
        };
    },

    componentDidMount: function () {
        this.getItems();
    },

    // 返回上一页
    goBack: function () {
        ReactRouter.hashHistory.goBack();
    },

    // 获取所有检查项和常用检查项
    getItems: function (parentId) {
        Toast.loading('加载中...', 0);
        var config = {
            url: ApiFactory.caseHistory.getIllHistoryRecordTypes,
            data: {
                access_token: localStorage.getItem('access_token'),
                parentId: parentId || 0
            }
        };
        Fetch(config)
            .then(function (result) {
                if (result) {
                    if (parentId) {
                        this.setState({
                            childItems: result.all || []
                        });
                    } else {
                        this.setState({
                            allItems: result.all || []
                        });
                    }
                    Toast.hide();
                }
            }.bind(this))
            .then(function () {
                if (parentId) {
                    this.openPopup(parent);
                }
            }.bind(this));
    },

    // 获取子类型
    getChildItems: function (id) {
        this.getItems(id);
    },

    // 打开Popup
    openPopup: function() {
        Popup.show(
            <div className="add-check-item-popup">
                <List className="popup-list" renderHeader={function () {
                    return (
                        <div style={{padding: '5px 10px', textAlign: 'end'}}>
                            <span
                                style={{color: '#108ee9'}}
                                onClick={function () {
                                    this.closePopup();
                                }.bind(this)} >
                            取消
                          </span>
                        </div>
                    );
                }.bind(this)}>
                    {
                        this.state.childItems.map(function (item) {
                            return this.renderCheckItem(item);
                        }.bind(this))
                    }
                </List>
            </div>, {animationType: 'slide-up'});
    },

    // 关闭Popup
    closePopup: function() {
        Popup.hide();
    },

    // 处理选中事件
    handleClick: function (item) {
        window.setCheckItemFromChildren(item);
        window.setTimeout(this.goBack, 200);
    },

    componentWillUnmount: function () {
        this.closePopup();
        Toast.hide();
    },

    // 渲染检查项
    renderCheckItem: function (item) {
        if (item.leaf) {
            return (
                <List.Item onClick={this.handleClick.bind(this, item)}>
                    {item.name}
                </List.Item>
            );
        } else {
            return (
                <List.Item arrow="horizontal" onClick={this.getChildItems.bind(this, item.id)}>
                    {item.name}
                </List.Item>
            );
        }
    },

    render: function() {
        var state = this.state;
        return (
            <List style={{marginTop: '10px'}} className="scroll-box">
                {
                    state.allItems && state.allItems.length > 0 &&
                    state.allItems.map(function (item) {
                        return this.renderCheckItem(item);
                    }.bind(this))
                }
            </List>
        );
    }
});

