// 预约--医生端 预约详情主页

var React = require('react');
var ApiFactory = require('./../../../cmp/ApiFactory.js');
var Fetch = require('./../../../fetch/fetch.js');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var Toast = AntdMobile.Toast;

var ProgressInfo = require('./../common/components/Progress.js');
var DoctorInfo = require('./DoctorInfo.js');


module.exports = React.createClass({

    getInitialState: function () {
        return {
            result: {},
            progressList: [
                {title: '待确定', isReach: false, source: 'waiting_green@2x.png'},
                {title: '已确定', isReach: false, source: 'comfirm_gray@2x.png'},
                {title: '已完成', isReach: false, source: 'finish_gray@2x.png'},
            ],
        };
    },

    componentDidMount: function () {
        document.title = '患者预约';
        Toast.loading('加载中...', 0);
        this.getAppointmentById();
    },

    getAppointmentById: function () {
        var item = this.props.item;
        var config = {
            url: ApiFactory.appointment.getAppointmentById,
            data: {
                access_token: localStorage.getItem('access_token'),
                id: localStorage.getItem('appointmentOrderId') || item && item.id
            }
        };
        Fetch(config)
            .then(function (result) {
                if (result) {
                    var progressList = this.initProgressList(result.status, this.state.progressList);
                    this.setState({
                        result: result,
                        progressList: progressList
                    });
                }
                Toast.hide();
            }.bind(this))
            .catch(function () {
                Toast.hide();
            });
    },

    // 初始化进度条
    initProgressList: function (status, progress) {
        // 预约单状态(空-全部 2-待确认 3-已确认 5-完成 6-取消)
        var progressStatus = -1;
        switch (status) {
            case 2:
                progressStatus = 0;
                break;
            case 3:
                progressStatus = 1;
                break;
            case 5:
                progressStatus = 2;
                break;
            case 6:
                progress.splice(progress.length - 1, 1, {title: '已取消', isReach: false, source: 'cancel_gray@2x.png'});
                progressStatus = 2;
                break;
        }

        // 替换图标
        if (progressStatus > -1) {
            for (var i = 0; i <= progressStatus; i++) {
                progress[i].isReach = true;
                progress[i].source = progress[i].source.replace(/gray/g, 'green');
            }
        }

        return progress;
    },

    componentWillUnmount: function () {
        Toast.hide();
    },

    render: function() {
        return (
            <div className="make-appointment" style={{background: '#f5f7f7'}}>
                <ProgressInfo list={this.state.progressList} />
                <DoctorInfo info={this.state.result} onRefresh={this.getAppointmentById.bind(this)} />
            </div>
        );
    }
});
