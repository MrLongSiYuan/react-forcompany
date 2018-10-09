// 慢病病历--医生端 添加疾病诊断

var React = require('react');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var ApiFactory = require('./../../../../cmp/ApiFactory.js');
var Fetch = require('./../../../../fetch/fetch.js');
var Moment = require('moment');
var List  = AntdMobile.List ;
var Flex = AntdMobile.Flex;
var Icon  = AntdMobile.Icon ;
var Toast = AntdMobile.Toast;
var DatePicker = AntdMobile.DatePicker;

var Textarea = require('./../components/Textarea.js');
var SaveButton = require('./../components/SaveButton.js');


module.exports = React.createClass({

    getInitialState: function() {
        return {
            illHistoryInfoId: this.props.location.state && this.props.location.state.illHistoryInfoId,
            startDate: Moment().locale('zh-cn'),
            endDate: '',
            remark: '',
            disease: {},
            isClick: false,
        };
    },

    componentDidMount: function() {
        window.selectDiseaseCallback = this.selectDiseaseCallback;
    },

    componentWillReceiveProps: function(nextProps) {
        if(nextProps.route.path == 'doctor_add_diagnoses') {
            this.setState({
                illHistoryInfoId: nextProps.location.query.illHistoryInfoId || '',
            })
        }
    },

    componentWillUnmount: function () {
        window.selectDiseaseCallback = null;
    },

    selectDiseaseCallback: function(disease) {
        this.setState({
            disease: disease || {}
        })
    },

    // 添加初步诊断
    add: function () {
        this.setState({isClick: true});

        if (!this.state.disease.id && !this.state.remark.trim()) {
            Toast.info('请选择疾病诊断或者填写疾病诊断内容');
            this.setState({isClick: false});
            return ;
        }


        var config = {
            url: ApiFactory.caseHistory.addDiagnosis,
            data: {
                access_token: localStorage.getItem('access_token'),
                illHistoryInfoId: localStorage.getItem('illHistoryInfoId'),
                diagnosisTime : this.state.startDate.valueOf(),
                endTime : this.state.endDate ? this.state.endDate.valueOf() : '',
                content: this.state.remark.trim(),
                diseaseId: this.state.disease.id
            }
        };
        Fetch(config)
            .then(function (result) {
                if (result) {
                    Toast.success('添加成功', function () {
                        window.removeIllHistoryRecordsFromStorage();
                        ReactRouter.hashHistory.goBack();
                    }.bind(this));
                }
                this.setState({isClick: false});
            }.bind(this))
            .catch(function () {
                this.setState({isClick: false});
            }.bind(this));
    },

    // 处理TextareaItem输入
    handleChange: function(value) {
        this.setState({
            remark: value
        });
    },

    // 选择疾病
    selectDisease: function() {
        ReactRouter.hashHistory.pushState(null, '/edc_add_diagnoses/select_disease');
    },

    // 清空结束时间
    clearDate: function(date, event) {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        var obj = {};
        obj[date] = '';
        this.setState(obj);
    },

    // 日期改变
    changeDate: function (type, date) {
        if (type == 'startDate') {
            if (this.state.endDate == '') {
                this.setState({
                    startDate: date,
                });
            } else {
                if (date.valueOf() > this.state.endDate.valueOf()) {
                    this.setState({
                        startDate: date,
                        endDate: date
                    });
                } else {
                    this.setState({
                        startDate: date,
                    });
                }
            }

        } else if (type == 'endDate') {
            if (date.valueOf() < this.state.startDate.valueOf()) {
                this.setState({
                    endDate: this.state.startDate
                });
            } else {
                this.setState({
                    endDate: date
                });
            }
        }
    },

    render: function() {
        return (
            <div className="scroll-box">
                <div style={this.props.children ? styles.hide : styles.body}>
                    <List style={{marginTop: '10px'}} className={ this.state.disease.name ? "list-item-extra-color" : ""}>
                        <List.Item extra={this.state.disease.name || '请选择'} arrow="horizontal"
                            onClick={this.selectDisease}>
                            疾病诊断</List.Item>
                    </List>

                    <List style={{marginTop: '10px'}}>
                        <div className={ this.state.startDate ? "list-item-extra-color" : ""}>
                            <DatePicker
                                mode="date"
                                title="选择日期"
                                extra="请选择"
                                value={this.state.startDate}
                                onChange={this.changeDate.bind(this, 'startDate')} >
                                <List.Item arrow="horizontal">诊断时间</List.Item>
                            </DatePicker>
                        </div>

                        <div className={ this.state.endDate ? "list-item-extra-color" : ""}>
                            <DatePicker
                                mode="date"
                                title="选择日期"
                                extra="如病情仍在持续，可不填写"
                                minDate={this.state.startDate}
                                value={this.state.endDate}
                                onChange={this.changeDate.bind(this, 'endDate')} >
                                <DatePickerChildren value={this.state.endDate} onClear={this.clearDate.bind(this)}>
                                    结束时间
                                </DatePickerChildren>
                            </DatePicker>
                        </div>
                    </List>
                    <Textarea onChangeContent={this.handleChange.bind(this)} placeholder="请输入疾病诊断内容"/>

                    <SaveButton onSave={this.add.bind(this)} isClick={this.state.isClick} />
                </div>
                <div style={this.props.children ? styles.body : styles.hide}>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

var DatePickerChildren = function (props) {
    var clear = function (event) {
        props.onClear('endDate', event);
    };
    return (
        <div onClick={props.onClick}>
            <List.Item arrow={props.value ? "" : "horizontal"}>
                <Flex>
                    {props.children}
                    <Flex.Item style={{textAlign: 'right'}}>
                        {
                            props.value ?
                                <div>
                                    {props.extra} <Icon onClick={clear} type='cross-circle' />
                                </div>
                                : <span style={{fontSize: '12px'}}>{props.extra}</span>
                        }
                    </Flex.Item>
                </Flex>
            </List.Item>
        </div>
    );
};

var styles = {
    hide: {
        display: 'none'
    },
    body: {
        width: '100%',
        height: '100%'
    },
    container: {
        padding: '10px 15px',
        marginTop: '15px',
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
    },
    flex: {
        flex: 1,
    },
};
