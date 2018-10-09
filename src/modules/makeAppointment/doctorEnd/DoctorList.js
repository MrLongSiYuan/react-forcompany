// 预约--医生端 我的预约列表

var React = require('react');
var ApiFactory = require('./../../../cmp/ApiFactory.js');
var Fetch = require('./../../../fetch/fetch.js');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var Toast = AntdMobile.Toast;

var Dropmenu = require('./Dropmenu.js');
var ListItem = require('./../common/components/ListItem.js');
var EmptyData = require('./../common/components/EmptyData.js');


module.exports = React.createClass({

    getInitialState: function () {
        return {
            result: [],
            menuItems: [
                {key: '', name: '全部', icon: 'icon_all_gray@2x.png'},
                {key: 2, name: '待确定', icon: 'icon_waiting_gray@2x.png'},
                {key: 3, name: '已确定', icon: 'icon_ensure_gray@2x.png'},
                {key: 5, name: '已服务', icon: 'icon_finish_gray@2x.png'},
                {key: 6, name: '已取消', icon: 'icon_cancel_gray@2x.png'}
            ]
        };
    },

    componentDidMount: function () {
        document.title = '患者预约';
        this.refreshAppointmentList();
    },

    // 请求列表数据
    getAppointmentList: function (status) {
        Toast.loading('加载中...', 0);
        // 预约单状态(空-全部 2-待确认 3-已确认 5-完成 6-取消)
        var config = {
            url: ApiFactory.appointment.getAppointmentDoctorList,
            data: {
                access_token: localStorage.getItem('access_token'),
                status: status || '',
            }
        };
        Fetch(config)
            .then(function (result) {
                if (!result || result.length == 0) {
                    result = [];
                }
                this.setState({
                    result: result
                });
                Toast.hide();
            }.bind(this))
            .catch(function () {
                Toast.hide();
            });
    },

    // 切换Tab
    handleChangeDropmenu: function (key) {
        this.setSelectedKey(key);
        this.getAppointmentList(key);
    },

    // 刷新预约列表
    refreshAppointmentList: function () {
        this.getAppointmentList(this.getSelectedKey());
    },

    // 获取已设置的Key
    getSelectedKey: function () {
        return localStorage.getItem('doctorSelectedKey');
    },

    // 设置已设置的Key
    setSelectedKey: function (key) {
        // 预约单状态(空-全部 2-待确认 3-已确认 5-完成 6-取消)
        return localStorage.setItem('doctorSelectedKey', key);

    },

    getIndexByKey: function (key) {
        var menu = this.state.menuItems;
        for (var i = 0; i < menu.length; i++) {
            if (menu[i].key == key) {
                return i;
            }
        }

        return 0;
    },

    componentWillUnmount: function () {
        Toast.hide();
    },

    render: function() {
        var index = this.getIndexByKey(this.getSelectedKey()) || 0;
        var type = this.props.type;
        var result = this.state.result;
        return (
            <div style={{height: '100%', width: '100%'}}>
                <Dropmenu defaultIndex={index} items={this.state.menuItems} onRefresh={this.handleChangeDropmenu.bind(this)} />
                <div style={{marginTop: '50px'}} className="scroll-box">
                    {
                        result && result.length > 0 ?
                            <ListItem type={type} list={result} onRefreshList={this.refreshAppointmentList.bind(this)} />
                            :
                            <EmptyData />
                    }
                </div>
            </div>
        );
    }
});
