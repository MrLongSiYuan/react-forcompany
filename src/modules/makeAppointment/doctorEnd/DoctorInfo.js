// 预约--医生端 预约信息

var React = require('react');
var ApiFactory = require('./../../../cmp/ApiFactory.js');
var Fetch = require('./../../../fetch/fetch.js');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var Flex = AntdMobile.Flex;
var Button = AntdMobile.Button;
var List = AntdMobile.List;
var Toast = AntdMobile.Toast;
var DatePicker = AntdMobile.DatePicker;
var Moment = require('moment');

var Textarea = require('./../common/components/Textarea.js');
var SaveButton = require('./../common/components/SaveButton.js');
var PotoCmp = require('./../../common/PotoCmp/PotoCmp.js');
var See_BigPhoto = require('./../../common/PotoCmp/SeeBigPhoto.js');
var Util = require('./../common/Util.js');


module.exports = React.createClass({

    getInitialState: function () {
        return {
            startTime: Moment().locale('zh-cn'),
            minDate: Moment().locale('zh-cn'),
            endTime: Moment().locale('zh-cn'),
            checkStartTime: '',
            checkEndTime: '',
            checkContent: '',
            remark: '',
            pics: [],
            cleanPics: false,
            isClick: false,
        };
    },

    componentWillReceiveProps: function (nextProps) {
        var status = nextProps.info.status;
        var checkContent = nextProps.info.checkContent || '';
        var remark = nextProps.info.remark || '';
        var checkStartTime = nextProps.info.checkStartTime ? Moment(nextProps.info.checkStartTime).locale('zh-cn') : '';
        var checkEndTime = nextProps.info.checkEndTime ? Moment(nextProps.info.checkEndTime).locale('zh-cn') : '';

        if (!remark && (status == 2 || status == 3)) {
            remark = '请您在检查当天不要吃早餐不喝水，空腹到院，并请按照预约时间准时到达检查地点！谢谢您的配合！';
        }

        this.setState({
            checkContent: checkContent,
            remark: remark,
            checkStartTime: checkStartTime,
            checkEndTime: checkEndTime,
        });
    },

    // 改变日期值
    handleChangeDate: function (value) {
        var newMoment = Moment(value.valueOf());
        var info = this.props.info;
        if (info.status == 3) {
            var config = {
                url: ApiFactory.appointment.updateCheckTime,
                data: {
                    access_token: localStorage.getItem('access_token'),
                    id: this.props.info.id,
                    checkStartTime: value.valueOf(),
                    checkEndTime: newMoment.valueOf(),
                }
            };
            Fetch(config)
                .then(function (result) {
                    if (result) {
                        this.setState({
                            checkStartTime: value,
                            checkEndTime: newMoment.add(7, 'days')
                        });
                    }
                }.bind(this));
        } else {
            this.setState({
                checkStartTime: value,
                checkEndTime: newMoment.add(7, 'days')
            });
        }
    },

    // 返回时间段
    calculateWeek: function(startTime, endTime) {
        startTime = Moment(startTime);
        endTime = Moment(endTime);
        return startTime.format('YYYY-MM-DD') + '至' + endTime.format('YYYY-MM-DD');
    },

    // 处理所选择的日期
    calculatePeriodsOfTime: function(moment) {
        if (!moment) {
            return ;
        }

        moment = Moment(moment);
        return moment.format('YYYY-MM-DD') + ' (' + Util.calculateWeekName(moment.day()) + ') ' + moment.format('HH:mm');
    },

    // 处理TextareaItem预约内容输入
    handleChangeContent: function(value) {
        this.setState({
            checkContent: value
        });
    },

    // 处理TextareaItem备注输入
    handleRemark: function(value) {
        this.setState({
            remark: value
        });
    },

    // 选择图片
    selectPhoto: function(imgs) {
        this.setState({
            pics: imgs
        });
    },

    // 上传检查单图片
    addCheckPicture: function () {
        var info = this.props.info;
        var pics = this.state.pics;
        var checkImgs = info.checkPic ? pics.concat(info.checkPic) : pics;

        var config = {
            url: ApiFactory.appointment.addCheckPicture,
            data: {
                access_token: localStorage.getItem('access_token'),
                id: this.props.info.id,
                checkImgs: checkImgs.toString(),
            }
        };
        Fetch(config)
            .then(function (result) {
                if (result) {
                    this.setState({
                        cleanPics: true
                    });
                    Toast.success('上传成功', 2, function () {
                        this.refreshData();
                        this.setState({
                            pics: [],
                            cleanPics: false
                        });
                    }.bind(this));
                }
            }.bind(this));
    },

    // 提交预约
    submitAppointment: function () {
        this.setState({isClick: true});
        var state = this.state;

        if (!state.checkStartTime) {
            Toast.info('请选择就诊时间');
            this.setState({isClick: false});
            return ;
        }

        if (!state.checkContent.trim()) {
            Toast.info('预约内容不能为空');
            this.setState({isClick: false});
            return ;
        }

        var config = {
            url: ApiFactory.appointment.submitAppointmentDoctor,
            data: {
                access_token: localStorage.getItem('access_token'),
                id: this.props.info.id,
                checkStartTime: state.checkStartTime.valueOf(),
                checkEndTime: state.checkEndTime.valueOf(),
                checkContent: state.checkContent.trim(),
                remark: state.remark.trim(),
            }
        };
        Fetch(config)
            .then(function (result) {
                if (result) {
                    Toast.success('提交成功', 2, function () {
                        this.refreshData();
                    }.bind(this));
                }
                this.setState({isClick: false});
            }.bind(this))
            .catch(function () {
                this.setState({isClick: false});
            }.bind(this));
    },

    // 刷新页面，请求新数据
    refreshData: function () {
        if (this.props.onRefresh) {
            this.props.onRefresh();
        }
    },

    // 提交已服务
    submitService: function () {
        this.setState({isClick: true});
        var state = this.state;
        var info = this.props.info;

        if (!state.checkStartTime) {
            Toast.info('请选择就诊时间');
            this.setState({isClick: false});
            return ;
        }

        var config = {
            url: ApiFactory.appointment.updateStatus,
            data: {
                access_token: localStorage.getItem('access_token'),
                id: info.id,
                remark: state.remark.trim(),
                status: '5',
            }
        };
        Fetch(config)
            .then(function (result) {
                if (result) {
                    Toast.success('提交成功', 2, function () {
                        this.refreshData();
                    }.bind(this));
                }
                this.setState({isClick: false});
            }.bind(this))
            .catch(function () {
                this.setState({isClick: false});
            }.bind(this));
    },

    // 取消预约
    cancelAppointment: function () {
        var config = {
            url: ApiFactory.appointment.webCancel,
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

    // 显示已上传的检查单
    showPic: function (info, state) {
        return (
            <div style={styles.wrapper}>
                {
                    info.checkPic && info.checkPic.length > 0 &&
                    <div style={{marginLeft: '10px', fontSize: '15px',}}>已上传的检查单：</div>
                }
                {
                    info.checkPic && info.checkPic.length > 0 &&
                    <div style={{margin: '10px', borderBottom: '1px solid #eff0ef'}}>
                        {
                            info.checkPic.map(function (pic, index) {
                                return <img
                                    onClick={See_BigPhoto.bind(this, info.checkPic, index)}
                                    style={{
                                        width: '51px',
                                        height: '51px',
                                        marginRight: '10px',
                                        marginBottom: '10px',
                                        borderRadius:'5px',
                                    }}
                                    src={Util.transformSmallImg(pic)} />
                            })
                        }
                    </div>
                }

                <div style={{margin: '0 0 -10px 10px', fontSize: '15px',}}>添加检查单：</div>
                <PotoCmp clean={state.cleanPics} callback={this.selectPhoto.bind(this)} />
                <p style={{color: '#ccc', fontSize: '13px', marginLeft: '10px'}}>
                    上传后请耐心等待后台转换，转换后将在检查项页面可查看检查单项数值
                </p>

                <div style={{margin: '10px 10px 5px 10px'}}>
                    <Button
                        activeStyle={{opacity: 0.8}}
                        disabled={state.pics.length == 0}
                        style={{
                            border: '1px solid #62d778',
                            color: '#62d778',
                            borderRadius: '3px',
                            background: 'transparent',
                            opacity: state.pics.length == 0 ? '0.5' : '1'
                        }}
                        onClick={this.addCheckPicture.bind(this)}>
                        <img style={{height: '20px', marginRight: '10px', verticalAlign: 'sub'}} src={require('./../common/images/icon_upload@2x.png')} />
                        上传检查单
                    </Button>
                </div>
            </div>
        );
    },

    // 渲染待确定内容
    renderWaiting: function (info, state) {
        return (
            <div>
                <div  className="appointment-info" style={{background: '#fff', padding: '15px'}}>
                    <p style={{
                        borderBottom: '1px solid #ddd',
                        paddingBottom: '7px',
                        marginBottom: '10px',
                        color: '#6c6c6c',
                    }}>预约编号：{info.appointmentNo}</p>

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
                        <Flex.Item className="appointment-info-item">
                            {this.calculateWeek(info.startTime, info.endTime)}
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            就诊时间：
                        </div>
                        <Flex.Item className="appointment-info-item appointment-info-datepicker">
                            <DatePicker
                                onChange={this.handleChangeDate.bind(this)}
                                minDate={state.minDate}
                                value={state.checkStartTime}
                                mode="datetime"
                                title="选择就诊时间">
                                <DatePickerChildren>
                                    <span style={{color: '#52a7e8'}}>{state.checkStartTime ? this.calculatePeriodsOfTime(state.checkStartTime) : '确定就诊时间'}</span>
                                </DatePickerChildren>
                            </DatePicker>
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            <span style={{letterSpacing: '32px'}}>姓</span>名：
                        </div>
                        <Flex.Item className="appointment-info-item" style={{position: 'relative', paddingRight: '30px'}} >
                            {info.patientName}
                        </Flex.Item>
                    </Flex>

                    <Flex justify="start" align="center">
                        <div style={styles.minWidth}>
                            联系电话：
                        </div>
                        <Flex.Item className="appointment-info-item" style={{position: 'relative', paddingRight: '30px'}} >
                            {info.patientTel}
                        </Flex.Item>
                    </Flex>
                </div>

                <Textarea content={state.checkContent} onChangeContent={this.handleChangeContent.bind(this)} rows={4} placeholder="请输入预约内容" />
                <Textarea content={state.remark} onChangeContent={this.handleRemark.bind(this)} rows={4} placeholder="请输入备注内容" />

                <SaveButton onSave={this.submitAppointment.bind(this)} isClick={state.isClick} content="提交预约" />
            </div>
        );
    },

    // 渲染已确定内容
    renderConfirmed: function (info, state) {
        return (
            <div>
                <div  className="appointment-info" style={{background: '#fff', padding: '15px'}}>
                    <p style={{
                        borderBottom: '1px solid #ddd',
                        paddingBottom: '7px',
                        marginBottom: '10px',
                        color: '#6c6c6c',
                    }}>预约编号：{info.appointmentNo}</p>

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
                            就诊时间：
                        </div>
                        <Flex.Item className="appointment-info-item appointment-info-datepicker">
                            <DatePicker
                                onChange={this.handleChangeDate.bind(this)}
                                minDate={state.minDate}
                                value={state.checkStartTime}
                                mode="datetime"
                                title="选择就诊时间">
                                <DatePickerChildren>
                                    <span style={{color: '#52a7e8'}}>{state.checkStartTime ? this.calculatePeriodsOfTime(state.checkStartTime) : ''}</span>
                                </DatePickerChildren>
                            </DatePicker>
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            <span style={{letterSpacing: '32px'}}>姓</span>名：
                        </div>
                        <Flex.Item className="appointment-info-item" style={{position: 'relative', paddingRight: '30px'}} >
                            {info.patientName}
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            联系电话：
                        </div>
                        <Flex.Item className="appointment-info-item" style={{position: 'relative', paddingRight: '30px'}} >
                            {info.patientTel}
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            预约内容：
                        </div>
                        <Flex.Item className="appointment-info-item">
                            {info.checkContent}
                        </Flex.Item>
                    </Flex>

                    <Flex justify="start" align="center">
                        <div style={styles.minWidth}>
                            提交时间：
                        </div>
                        <Flex.Item className="appointment-info-item">
                            {Moment(info.submitTime).format('YYYY-MM-DD') + ' ' + Moment(info.submitTime).format('HH:mm')}
                        </Flex.Item>
                    </Flex>
                </div>

                <Textarea content={state.remark} onChangeContent={this.handleRemark.bind(this)} rows={4} placeholder="请输入备注内容" />
                {
                    this.showPic(info, state)
                }
                <SaveButton onSave={this.submitService.bind(this)} isClick={state.isClick} content="已服务" />
                <div style={{textAlign: 'center', marginBottom: '20px'}}>
                    <Button onClick={this.cancelAppointment.bind(this)} activeStyle={{color: '#ccc', background: 'transparent'}} style={{border: 0, color: '#52a7e8', fontSize: '16px'}} type="ghost" inline>取消预约</Button>
                </div>
            </div>
        );
    },

    // 渲染已服务或者已取消内容
    renderFinish: function (info, state) {
        var status = info.status;
        return (
            <div style={{position: 'relative'}}>
                <div  className="appointment-info" style={{background: '#fff', padding: '15px'}}>
                    <p style={{
                        borderBottom: '1px solid #ddd',
                        paddingBottom: '7px',
                        marginBottom: '10px',
                        color: '#6c6c6c',
                    }}>预约编号：{info.appointmentNo}</p>

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
                            就诊时间：
                        </div>
                        <Flex.Item className="appointment-info-item">
                            {this.calculatePeriodsOfTime(info.checkStartTime)}
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            <span style={{letterSpacing: '32px'}}>姓</span>名：
                        </div>
                        <Flex.Item className="appointment-info-item" style={{position: 'relative', paddingRight: '30px'}} >
                            {info.patientName}
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            联系电话：
                        </div>
                        <Flex.Item className="appointment-info-item" style={{position: 'relative', paddingRight: '30px'}} >
                            {info.patientTel}
                        </Flex.Item>
                    </Flex>

                    <Flex style={styles.flex} justify="start" align="center">
                        <div style={styles.minWidth}>
                            预约内容：
                        </div>
                        <Flex.Item className="appointment-info-item">
                            {info.checkContent}
                        </Flex.Item>
                    </Flex>

                    <Flex justify="start" align="center">
                        <div style={styles.minWidth}>
                            提交时间：
                        </div>
                        <Flex.Item className="appointment-info-item">
                            {Moment(info.submitTime).format('YYYY-MM-DD') + ' ' + Moment(info.submitTime).format('HH:mm')}
                        </Flex.Item>
                    </Flex>
                </div>

                {
                    info.remark &&
                    <p style={{wordWrap: 'break-word', marginTop: '10px', background: '#fff', padding: '10px 15px'}}>
                        <span style={{color: '#6c6c6c'}}>备注：</span>{info.remark}
                    </p>
                }

                {
                    status == 5 && this.showPic(info, state)
                }

                <img style={{
                    position: 'absolute',
                    right: '15px',
                    top: 0,
                    height: '40px',
                    width: '75px',
                }} src={Util.showStatus(info)} />
            </div>
        );
    },

    // 根据预约单的status状态显示不同内容
    getRender: function (info, state) {
        if (!info.status) {
            return ;
        }

        var view;
        switch (info.status) {
            case 2:
                view = this.renderWaiting(info, state);
                break;
            case 3:
                view = this.renderConfirmed(info, state);
                break;
            case 5:
            case 6:
                view = this.renderFinish(info, state);
                break;
        }

        return view;
    },

    render: function() {
        var info = this.props.info;
        var state = this.state;
        var render = this.getRender(info, state);
        return (
            <div>
                {render}
            </div>
        );
    }
});

var DatePickerChildren = function (props) {
    return (
        <div onClick={props.onClick}>
            <List.Item arrow="horizontal">
                <span style={{fontSize: '16px'}}>
                    {props.children}
                </span>
            </List.Item>
        </div>
    );
};

var styles = {
    wrapper: {
        marginTop: '10px',
        background: '#fff',
        padding: '10px 5px'
    },
    flex: {
        marginBottom: '10px',
    },
    minWidth: {
        minWidth: '80px',
        color: '#6c6c6c',
    }
};
