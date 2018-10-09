// 预约--患者端 预约详情主页

var React = require('react');
var ApiFactory = require('./../../../cmp/ApiFactory.js');
var Fetch = require('./../../../fetch/fetch.js');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var Toast = AntdMobile.Toast;

var PatientInfo = require('./PatientInfo.js');
var RemainderAppointment = require('./RemainderAppointment.js');
var ProgressInfo = require('./../common/components/Progress.js');


module.exports = React.createClass({

    getInitialState: function () {
        return {
            result: {},
            progressList: [
                {title: '提交预约', isReach: false, source: 'submit_appiontment_no.png'},
                {title: '预约确认', isReach: false, source: 'appointment_confirm_no.png'},
                {title: '线下服务', isReach: false, source: 'offline_service_no.png'},
                {title: '服务完成', isReach: false, source: 'services_completed_no.png'}
            ],
            count: 0,
            status: ''
        };
    },

    componentDidMount: function () {
        document.title = '我的预约';
        Toast.loading('加载中...', 0);
        this.getAppointmentById();

        // 预约状态为1（可预约）
        var status = this.state.status;
        if (status === 1 || !status) {
            this.getAppointmentCount();
        }
    },

    // 获取预约详情
    getAppointmentById: function () {
        var item = this.props.item;
        var config = {
            url: ApiFactory.appointment.getAppointmentById,
            data: {
                access_token: localStorage.getItem('access_token'),
                id: localStorage.getItem('appointmentOrderId') || (item && item.id)
            }
        };
        Fetch(config)
            .then(function (result) {
                if (result) {
                    var progressList = this.initProgressList(result.status, this.state.progressList);
                    this.setState({
                        result: result,
                        progressList: progressList,
                        status: result.status
                    });
                }
                Toast.hide();
            }.bind(this))
            .catch(function () {
                Toast.hide();
            });
    },

    // 获取剩余预约次数
    getAppointmentCount: function () {
        var url = '?access_token=' + localStorage.getItem('access_token');
        var config = {
            url: ApiFactory.appointment.balance + url,
            type: 'GET'
        };
        Fetch(config)
            .then(function (data) {
                if (data) {
                    this.setState({
                        count: data
                    });
                }
                
            }.bind(this))
            .catch(function (e) {
                console.error('getAppointmentCount');
            });
    },

    // 初始化进度条
    initProgressList: function (status, progress) {
        //status (1-可预约 2-待确认 3-已确认 4-开始/线下服务 5-完成 6-取消)
        var progressStatus = -1;
        switch (status) {
            case 1:
                progressStatus = 0;
                break;
            case 2:
                progressStatus = 1;
                break;
            case 3:
                progressStatus = 2;
                break;
            case 5:
                progressStatus = 3;
                break;
            case 6:
                progress = [{title: '已取消', isReach: true, source: 'cancel.png'}];
                progressStatus = 0;
                break;
        }

        // 替换图标
        if (progressStatus > -1) {
            for (var i = 0; i <= progressStatus; i++) {
                progress[i].isReach = true;
                progress[i].source = progress[i].source.replace(/no.png/g, 'yes.png');
            }
        }

        return progress;
    },

    componentWillUnmount: function () {
        Toast.hide();
    },

    render: function() {
        var state = this.state;
        var count = state.count || 0;
        var status = state.status || '';
        var info = state.result || '';
        
        return (
            <div className="make-appointment" style={{background: '#f5f7f7'}}>
                {
                    status === 1 &&
                    <RemainderAppointment appointmentCount={count} />
                }
                <ProgressInfo list={this.state.progressList} />
                <PatientInfo
                    info={info}
                    appointmentCount={count}
                    onRefresh={this.getAppointmentById.bind(this)}
                    getAppointmentCount={this.getAppointmentCount}
                />
            </div>
        );
    }
});
