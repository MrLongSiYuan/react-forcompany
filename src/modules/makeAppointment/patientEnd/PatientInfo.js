// 预约--患者端 预约信息

var React = require('react');
var ApiFactory = require('./../../../cmp/ApiFactory.js');
var Fetch = require('./../../../fetch/fetch.js');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var Flex = AntdMobile.Flex;
var List = AntdMobile.List;
var Toast = AntdMobile.Toast;
var Modal = AntdMobile.Modal;
var DatePicker = AntdMobile.DatePicker;
var Moment = require('moment');
var Cordova = require('./../../../cordova/cordova_main.js');
var Call_App_Pay = Cordova.call_app_pay;

var NoticeMessage = require('./NoticeMessage.js');
var SaveButton = require('./../common/components/SaveButton.js');
var CancelButton = require('./CancelButton.js');
var Textarea = require('./../common/components/Textarea.js');
var ModalPrompt = require('./ModalPrompt.js');
var Util = require('./../common/Util.js');


module.exports = React.createClass({

    getInitialState: function () {
        return {
            startTime: Moment().locale('zh-cn'),
            startTimeFromItem: '',
            isSetTime: '',
            minDate: Moment().locale('zh-cn'),
            startTimeStr: '',
            endTime: Moment().locale('zh-cn'),
            endTimeStr: '',
            submitTime: '',
            patientName: '',
            patientTel: '',
            checkContent: '',
            isClick: false,
        };
    },

    componentWillReceiveProps: function (nextProps) {
        var startTime = nextProps.info.startTime ? Moment(nextProps.info.startTime).locale('zh-cn') : Moment().locale('zh-cn');
        var endTime = nextProps.info.endTime ? Moment(nextProps.info.endTime).locale('zh-cn') : Moment().locale('zh-cn');
        var checkStartTime = nextProps.info.checkStartTime && Moment(nextProps.info.checkStartTime).locale('zh-cn');
        var checkEndTime = nextProps.info.checkEndTime && Moment(nextProps.info.checkEndTime).locale('zh-cn');
        var submitTime = nextProps.info.submitTime ? Moment(nextProps.info.submitTime).locale('zh-cn') : Moment().locale('zh-cn');
        var checkContent = nextProps.info.checkContent;
        var patientName = nextProps.info.patientName;
        var patientTel = nextProps.info.patientTel;
        var status = nextProps.info.status;
        var memberLevel = nextProps.info.memberLevel;
        this.setState({
            startTimeFromItem: startTime,
            checkContent: checkContent,
            patientName: patientName,
            patientTel: patientTel,
            submitTime: submitTime.format('YYYY-MM-DD HH:mm'),
            memberLevel: memberLevel
        });

        //status (1-可预约 2-待确认 3-已确认 4-开始/线下服务 5-完成 6-取消)
        if (status == 1 || status == 2) {
            this.changeDate(status, startTime, endTime, true);
        } else if (status == 6) {
            this.changeDate(status, checkStartTime ? checkStartTime : startTime, checkEndTime ? checkEndTime : endTime);
        } else {
            this.changeDate(status, checkStartTime, checkEndTime);
        }

    },

    // 改变日期值
    changeDate: function (status, startTime, endTime, isNew) {
        var newMoment, startTimeStr, endTimeStr;
        switch (status) {
            case 1:
                newMoment = Moment(startTime.valueOf());
                endTime = newMoment.add(7, 'days');
                startTimeStr = this.calculateWeek(startTime);
                startTime = startTime.valueOf() > this.state.minDate.valueOf() ? startTime : this.state.minDate;
                endTimeStr = this.setEndTime(endTime);
                break;
            case 2:
                startTimeStr = this.calculateWeek(startTime);
                endTimeStr = this.setEndTime(endTime);
                break;
            default :
                startTimeStr = this.setEndTime(startTime);
                break;
        }

        this.setState({
            isSetTime: !isNew,
            startTime: startTime,
            endTime: endTime,
            startTimeStr: startTimeStr,
            endTimeStr: endTimeStr,
        });
    },

    // 处理TextareaItem输入
    handleChange: function(value) {
        this.setState({
            checkContent: value
        });
    },

    // 提交预约
    submitAppointment: function () {
        this.setState({isClick: true});
        var state = this.state;

        var currentTime = state.isSetTime ? state.startTime.valueOf() : state.startTimeFromItem.valueOf();
        if (currentTime < state.minDate.valueOf()) {
            Toast.info('预约时间请于今日之后，请重新选择');
            this.setState({isClick: false});
            return ;
        }

        if (!state.checkContent) {
            Toast.info('预约内容不能为空');
            this.setState({isClick: false});
            return ;
        }

        var config = {
            url: ApiFactory.appointment.submitAppointment,
            data: {
                access_token: localStorage.getItem('access_token'),
                id: this.props.info.id,
                startTime: state.startTime.valueOf(),
                endTime: state.endTime.valueOf(),
                patientName: state.patientName.trim(),
                patientTel: state.patientTel.trim(),
                checkContent: state.checkContent.trim(),
            }
        };
        Fetch(config)
            .then(function (result) {
                if (result) {
                    Toast.success('提交成功', 2, function () {
                        this.refreshData();
                        // window.refreshAppointmentList && window.refreshAppointmentList();
                    }.bind(this));
                }
                this.setState({isClick: false});
            }.bind(this))
            .catch(function () {
                this.setState({isClick: false});
            }.bind(this));
    },

    // 提交，判断预约次数是否为0，是否需要支付购买
    submit: function () {
        if (this.props.appointmentCount > 0) {
            this.submitAppointment();
        } else {
            // 0非会员 1普通会员 2高级会员 3VIP会员 4高级VIP
            var memberLevel = this.state.memberLevel
            if (memberLevel == 0 || memberLevel == 1) {
                this.suggestUpgrade();
            } else if (memberLevel == 2 || memberLevel == 3) {
                this.openPayView();
            } else if (memberLevel == 4) {
                this.setAppointmentByVip();
            }
        }
    },

    
    suggestUpgrade: function () {
        var self = this;
        Modal.alert('预约', '当前暂不能购买预约服务，您可与客服联系或升级会员等级',
            [
                { text: '确定'}
            ]
        );
    },

    // 打开APP支付
    openPayView: function () {
        var self = this;
        Modal.alert('预约', '您的预约次数已用完，暂不能申请预约，建议您再次购买预约服务，方便医生为您解决问题',
            [
                { text: '取消'},
                { text: '购买预约服务', onPress: function() {
                    try {
                        Call_App_Pay({}, function () {
                            self.props.getAppointmentCount();
                        });
                    } catch (error) {
                        console.error('Call_App_Pay');
                    }
                }},
            ]
        );
    },

    setAppointmentByVip: function () {
        var self = this;
        Modal.alert('预约', '当前会员购买本服务免费，点击可直接购买',
            [
                { text: '暂不需要'},
                { text: '需要', onPress: function() {
                    var config = {
                        url: ApiFactory.appointment.createAppointmentRechargeOrder,
                        data: {
                            access_token: localStorage.getItem('access_token')
                        }
                    };
                    
                    Fetch(config)
                        .then(function (result) {
                            if (result) {
                                Toast.success('提交成功', 2, function () {
                                    self.props.getAppointmentCount();
                                }.bind(this));
                            }
                        }.bind(this))
                        .catch(function () {
                            console.error('setAppointmentByVip');
                        });
                }},
            ]
        );
    },

    // 刷新页面，请求新数据
    refreshData: function () {
        if (this.props.onRefresh) {
            this.props.onRefresh();
        }
    },

    // 处理所选择的日期
    calculateWeek: function(moment) {
        return moment.format('YYYY-MM-DD') + ' (' + Util.calculateWeekName(moment.day()) + ') 至';
    },

    // 编辑患者姓名/电话
    editPatientInfo: function (type, defaultValue) {
        var title = type == 'patientName' ? '编辑姓名' : '编辑联系电话';
        var maxLength = type == 'patientName' ? 10 : 11;

        this.refs.prompt.showModal({
            type: type,
            title: title,
            value: defaultValue,
            maxLength: maxLength
        });
    },

    // 处理Modal弹出框修改信息
    changePatientInfo: function(type, value) {
        var obj = {};
        obj[type] = value;
        this.setState(obj);
    },

    // 设置endTime字符串
    setEndTime: function (moment) {
        if (!moment) {
            return '';
        }
        
        return moment.format('YYYY-MM-DD') + ' (' + Util.calculateWeekName(moment.day()) + ')';
    },

    // 取消预约
    cancelAppointment: function () {
        var config = {
            url: ApiFactory.appointment.cancel,
            data: {
                access_token: localStorage.getItem('access_token'),
                id: this.props.info.id,
            }
        };
        Fetch(config)
            .then(function (result) {
                if (result) {
                    Toast.success('成功取消预约', 2, function () {
                        this.refreshData();
                    }.bind(this));
                }
            }.bind(this));
    },

    renderSubmitAppointment: function (info, state) {
        return (
            <div>
                <div className="appointment-info" style={{background: '#fff', padding: '15px'}}>
                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            服务地点：
                        </div>
                        <Flex.Item className="appointment-info-item">
                            {info.hospitalName}
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            预约时间：
                        </div>
                        <Flex.Item className="appointment-info-item appointment-info-datepicker">
                            <DatePicker
                                onChange={this.changeDate.bind(this, info.status)}
                                minDate={state.minDate}
                                value={state.startTime}
                                mode="date"
                                title="预约时间">
                                <DatePickerChildren>
                                    {state.startTimeStr}
                                    <p>{state.endTimeStr}</p>
                                </DatePickerChildren>
                            </DatePicker>
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            <span style={{letterSpacing: '32px'}}>姓</span>名：
                        </div>
                        <Flex.Item className="appointment-info-item" style={{position: 'relative', paddingRight: '30px'}} >
                            {state.patientName}
                            <EditBtn onEdit={this.editPatientInfo.bind(this, 'patientName', state.patientName)} />
                        </Flex.Item>
                    </Flex>

                    <Flex justify="start" align="center">
                        <div style={styles.minWidth}>
                            联系电话：
                        </div>
                        <Flex.Item className="appointment-info-item" style={{position: 'relative', paddingRight: '30px'}} >
                            {state.patientTel}
                            <EditBtn onEdit={this.editPatientInfo.bind(this, 'patientTel', state.patientTel)} />
                        </Flex.Item>
                    </Flex>
                </div>
                <Textarea content={this.state.checkContent} onChangeContent={this.handleChange.bind(this)} rows={4} placeholder="请输入预约内容" />
                <NoticeMessage />
                <SaveButton onSave={this.submit.bind(this)} isClick={state.isClick} content="提交预约" />
                <ModalPrompt ref='prompt' onChangeInfo={this.changePatientInfo.bind(this)} />
            </div>
        );
    },

    renderOtherStatus: function (info, state) {
        return (
            <div style={{marginBottom: '25px'}}>
                <div  className="appointment-info" style={{background: '#fff', padding: '15px'}}>
                    <p style={{
                        borderBottom: '1px solid #ddd',
                        paddingBottom: '7px',
                        marginBottom: '10px',
                        color: '#ababab',
                    }}>预约编号{info.appointmentNo}</p>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            服务地点：
                        </div>
                        <Flex.Item className="appointment-info-item">
                            {info.hospitalName}
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            {info.status == 2 ? '预约时间：' : '就诊时间：'}
                        </div>
                        {
                            info.status == 2 ?
                                <Flex.Item className="appointment-info-item appointment-info-datepicker">
                                    <Flex.Item className="appointment-info-item">
                                        {state.startTimeStr}
                                        <p>{state.endTimeStr}</p>
                                    </Flex.Item>
                                </Flex.Item>
                                :
                                <Flex.Item className="appointment-info-item appointment-info-datepicker">
                                    <Flex.Item className="appointment-info-item">
                                        {state.startTimeStr}
                                        <p>{state.startTime && state.startTime.format('HH:mm')}-{state.endTime && state.endTime.format('HH:mm')}</p>
                                    </Flex.Item>
                                </Flex.Item>
                        }

                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            <span style={{letterSpacing: '32px'}}>姓</span>名：
                        </div>
                        <Flex.Item className="appointment-info-item" style={{position: 'relative', paddingRight: '30px'}} >
                            {state.patientName}
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            联系电话：
                        </div>
                        <Flex.Item className="appointment-info-item" style={{position: 'relative', paddingRight: '30px'}} >
                            {state.patientTel}
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            预约内容：
                        </div>
                        <Flex.Item className="appointment-info-item">
                            {state.checkContent}
                        </Flex.Item>
                    </Flex>

                    <Flex justify="start" align="center">
                        <div style={styles.minWidth}>
                            提交时间：
                        </div>
                        <Flex.Item className="appointment-info-item">
                            {state.submitTime}
                        </Flex.Item>
                    </Flex>

                    {
                        info.status == 2 &&
                        <CancelButton
                            onCancel={this.cancelAppointment.bind(this)}
                            title="取消预约"
                            content="是否确定取消预约？"
                            okBtnText="是"
                            cancelBtnText="否" />
                    }
                    {
                        info.status == 3 &&
                        <CancelButton
                            phoneNum="02089814010"
                            title="预约"
                            content="已为您确定预约，取消或者修改预约时间，请拨打020-89814010"
                            okBtnText="拨打电话"
                            cancelBtnText="关闭"  />
                    }

                </div>
                <NoticeMessage />
            </div>
        );
    },

    render: function() {
        var info = this.props.info;
        var state = this.state;
        var render = info.status == 1 ? this.renderSubmitAppointment(info, state) : this.renderOtherStatus(info, state);
        return (
            <div>
                {render}
            </div>
        );
    }
});

var styles = {
    flex: {
        marginBottom: '10px',
    },
    minWidth: {
        minWidth: '80px',
        color: '#6c6c6c',
    }
};

var DatePickerChildren = function (props) {
    return (
        <div onClick={props.onClick}>
            <List.Item arrow="horizontal">
                <span style={{fontSize: '16px'}}>
                    {/*{props.extra}*/}
                    {props.children}
                </span>
            </List.Item>
        </div>
    );
};

var EditBtn = React.createClass({

    // 点击事件
    edit: function (type, value) {
        if (this.props.onEdit) {
            this.props.onEdit(type, value);
        }
    },

    render: function() {
        return (
            <span
                style={{
                    backgroundImage: 'url(' + require("./../common/images/edit_btn.png") + ')',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: '0px',
                    backgroundSize: '20px 18px',
                    width: '20px',
                    height: '100%',
                    position: 'absolute',
                    right: '5px',
                }}
                onClick={this.edit.bind(this)}
            />
        );
    }
});
