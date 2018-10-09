// 慢病病历--医生端 添加疾病诊断

var React = require('react');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var ApiFactory = require('./../../../../cmp/ApiFactory.js');
var Fetch = require('./../../../../fetch/fetch.js');
var Toast = AntdMobile.Toast;

var Textarea = require('./../components/Textarea.js');
var SaveButton = require('./../components/SaveButton.js');


module.exports = React.createClass({

    getInitialState: function() {
        var condition = this.props.location.state && this.props.location.state.condition;
        return {
            allergicHistory: condition.allergyHistory || '',
            previousHistory: condition.pastHistory || '',
            presentHistory: condition.currentDiseaseHistory || '',
            personalHistory: condition.personalHistory || '',
            familyHistory: condition.familyHistory || '',
            array: [
                {name: 'presentHistory', title: '现病史', placeholder: '请按疾病事件记录格式（发生时间、治疗、疗效评估）：\n参考范例：\n活动性疾病：\nHCC  CLC A (2015.5CT发现，\nTACE 2015.5.5\nRFA 2015.6.5\nCR 2016.6.5\n高血压病，III期，2010.4，\n科素亚 10mg/d（2010.5）,SD'},
                {name: 'previousHistory', title: '既往史', placeholder: '请按疾病事件记录格式（发生时间、治疗、疗效评估）：\n参考范例：\n非活动性疾病：\n肺结核（1995.6，四联治疗6个月）\n肾囊肿（2001.5）'},
                {name: 'allergicHistory', title: '过敏史', placeholder: '请输入过敏史...'},
                {name: 'personalHistory', title: '个人史', placeholder: '请输入个人史...'},
                {name: 'familyHistory', title: '家族史', placeholder: '请输入家族史...'}
            ],
            isClick: false,
        };
    },

    // 保存病情资料
    saveDetail: function () {
        this.setState({isClick: true});

        var config = {
            url: ApiFactory.caseHistory.editIllContentInfo,
            data: {
                access_token: localStorage.getItem('access_token'),
                illHistoryInfoId: localStorage.getItem('illHistoryInfoId'),
                allergyHistory: this.state.allergicHistory.trim(),
                pastHistory: this.state.previousHistory.trim(),
                currentDiseaseHistory: this.state.presentHistory.trim(),
                personalHistory: this.state.personalHistory.trim(),
                familyHistory: this.state.familyHistory.trim(),
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
    handleChange: function(type, value) {
        var obj = {};
        obj[type] = value;
        this.setState(obj);
    },

    render: function() {
        return (
            <div className="scroll-box">
                {
                    this.state.array.map(function (item, index) {
                        return (
                            <div style={{marginTop: '15px'}} className="edit-disease-condition">
                                <p style={{color: '#666', paddingLeft: '15px', fontSize: '15px', marginBottom: '-10px'}}>{item.title}</p>
                                <Textarea count={1000} rows={(index == 0 || index == 1) ? "" : "4"} content={this.state[item.name]} onChangeContent={this.handleChange.bind(this, item.name)} placeholder={item.placeholder}/>
                            </div>
                        );
                    }.bind(this))
                }

                <SaveButton onSave={this.saveDetail.bind(this)} isClick={this.state.isClick} />
            </div>
        );
    }
});
