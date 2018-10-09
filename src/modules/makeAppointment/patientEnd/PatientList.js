// 预约--患者端 我的预约列表

var React = require('react');
var ApiFactory = require('./../../../cmp/ApiFactory.js');
var Fetch = require('./../../../fetch/fetch.js');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var Tabs = AntdMobile.Tabs;
var Toast = AntdMobile.Toast;

var ListItem = require('./../common/components/ListItem.js');
var EmptyData = require('./../common/components/EmptyData.js');


module.exports = React.createClass({

    getInitialState: function () {
        return {
            result: []
        };
    },

    componentWillMount: function () {
        this.setActiveKey(this.getActiveKey());
    },

    componentDidMount: function () {
        document.title = '我的预约';
        // 预约单状态(默认查询全部 1-可预约 2-待确认 3-已确认 5-完成 6-取消)
        this.refreshAppointmentList(true);
    },

    // 请求列表数据
    getAppointmentList: function (status) {
        Toast.loading('加载中...', 0);
        var config = {
            url: ApiFactory.appointment.getAppointmentList,
            data: {
                access_token: localStorage.getItem('access_token'),
                statusList: status,
            }
        };
        Fetch(config)
            .then(function (result) {
                if (result && result.pageData) {
                    this.setState({
                        result: result.pageData
                    });
                }
                Toast.hide();
            }.bind(this))
            .catch(function () {
                Toast.hide();
            });
    },

    // 切换Tab
    handleChangeTags: function (key) {
        this.setActiveKey(key);
        this.getAppointmentList(key);
    },

    // 刷新预约列表
    refreshAppointmentList: function () {
        this.getAppointmentList(this.getActiveKey());
    },

    // 获取已设置的tabKey
    getActiveKey: function () {
        return localStorage.getItem('patientActiveKey');
    },

    // 设置已设置的tabKey
    setActiveKey: function (key) {
        // 预约单状态(默认查询全部 1-可预约 2-待确认 3-已确认 5-完成 6-取消)
        return localStorage.setItem('patientActiveKey', key || 1);

    },

    componentWillUnmount: function () {
        Toast.hide();
    },

    render: function() {
        var key = this.getActiveKey() + '';
        var type = this.props.type;
        var result = this.state.result;
        var listItem = result && result.length > 0 ? <ListItem type={type} list={result} onRefreshList={this.refreshAppointmentList.bind(this)} /> : <EmptyData />;
        return (
            <div style={{height: '100%', width: '100%'}}>
                {/*<div className="make-appointment" style={this.props.children ? styles.hide : styles.body}>*/}
                <div className="make-appointment" style={{background: '#f5f7f7', height: '100%', width: '100%'}}>
                    <Tabs defaultActiveKey={key} animated={false} onChange={this.handleChangeTags}>
                        <Tabs.TabPane tab="可预约" key="1">
                            {listItem}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="已预约" key="2,3">
                            {listItem}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="已完成" key="5">
                            {listItem}
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="已取消" key="6">
                            {listItem}
                        </Tabs.TabPane>
                    </Tabs>
                </div>
                {/*<div style={this.props.children ? styles.body : styles.hide}>*/}
                    {/*{this.props.children}*/}
                {/*</div>*/}
            </div>
        );
    }
});

var styles = {
    hide: {
        display: 'none'
    },
    body: {
        width: '100%',
        height: '100%',
        background: '#f5f7f7'
    },
};
