// 慢病病历--医生端 患者编辑

var React = require('react');
var ReactRouter = require('react-router');
var ApiFactory = require('./../../../cmp/ApiFactory.js');
var Fetch = require('./../../../fetch/fetch.js');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var List = AntdMobile.List;
var InputItem = AntdMobile.InputItem;
var Toast = AntdMobile.Toast;
var ActionSheet = AntdMobile.ActionSheet;

var Tags = require('./PatientTag.js');
var SaveButton = require('./../common/components/SaveButton.js');


module.exports = React.createClass({

    getInitialState: function() {
        var patientInfo = this.props.location.state && this.props.location.state.patientInfo || {};
        return {
            remarkName: patientInfo.remarkName || '',
            tags: patientInfo.tags || [],
            remark: patientInfo.remark || '',
            height: patientInfo.height || '',
            weight: patientInfo.weight || '',
            marriage: patientInfo.marriage || '',
            profession: patientInfo.job || '',
            allTags: [],
            isClick: false
        };
    },

    // 请求所有历史标签
    getPatientTags: function () {
        var config = {
            url: ApiFactory.caseHistory.getPatientTags,
            data: {
                access_token: localStorage.getItem('access_token')
            }
        };
        Fetch(config)
            .then(function (result) {
                if (result && result.length > 0) {
                    this.setState({
                        allTags: result
                    });
                }
            }.bind(this));
    },

    // 打开ActionSheet
    openActionSheet: function () {
        var BUTTONS = ['未婚', '已婚', '取消'];
        ActionSheet.showActionSheetWithOptions({
                options: BUTTONS,
                cancelButtonIndex: BUTTONS.length - 1,
                maskClosable: true,
            },
            function (buttonIndex) {
                if (buttonIndex != BUTTONS.length - 1) {
                    this.selectMarriage(BUTTONS[buttonIndex]);
                }
            }.bind(this));
    },

    // 关闭ActionSheet
    closeActionSheet: function () {
        ActionSheet.close();
    },

    // 选择已婚、未婚
    selectMarriage: function (value) {
        this.setState({marriage: value});
    },

    componentWillMount: function () {
        if (this.state.allTags.length == 0) {
            this.getPatientTags();
        }
    },

    componentDidMount: function () {
        window.setSelectedTagsFromChildren = this.setSelectedTagsFromChildren.bind(this);
    },

    componentWillUnmount: function () {
        this.closeActionSheet();
        window.setTagsFromChildren = null;
    },

    // 保存编辑信息
    saveInfo: function () {
        this.setState({isClick: true});

        var config = {
            url: ApiFactory.caseHistory.editPatientInfo,
            data: {
                access_token: localStorage.getItem('access_token'),
                // doctorId: localStorage.getItem('doctorId'),
                // patientId: localStorage.getItem('patientId'),
                illHistoryInfoId: localStorage.getItem('illHistoryInfoId'),
                remarkName: this.state.remarkName.trim(),
                tags: this.state.tags.toString(),
                remark: this.state.remark.trim(),
                height: this.state.height,
                weight: this.state.weight,
                marriage: this.state.marriage,
                job: this.state.profession.trim()
            }
        };
        Fetch(config)
            .then(function (result) {
                if (result) {
                    Toast.success('编辑成功', 3, function () {
                        localStorage.removeItem('patientInfo');
                        window.removePatientInfoFromStorage();
                        ReactRouter.hashHistory.goBack();
                    }.bind(this));
                }
                this.setState({isClick: false});
            }.bind(this))
            .catch(function () {
                this.setState({isClick: false});
            }.bind(this));
    },

    // 设置children组件的选中标签
    setSelectedTagsFromChildren: function (selectedTag, allTags) {
        this.setState({
            tags: selectedTag,
            allTags: allTags
        });
    },

    // 处理所有Input输入
    handleChange: function(key, value) {
        var temp = {};
        temp[key] = value;
        this.setState(temp);
    },

    // 跳转到添加标签
    goToAddTags: function () {
        ReactRouter.hashHistory.pushState({ selectedTags: this.state.tags, allTags: this.state.allTags }, '/edc_doctor_edit/edc_doctor_add_tag');
    },

    render: function() {

        return (
            <div className="patient-info-edit scroll-box">
                <div style={this.props.children ? styles.hide : styles.body}>
                    <List>
                        <InputItem
                            maxLength={20}
                            onChange={this.handleChange.bind(this, 'remarkName')}
                            value={this.state.remarkName}
                            placeholder="填写备注名">备注名</InputItem>

                        <List.Item
                            onClick={this.goToAddTags}
                            className="edit-title"
                            extra={<Tags tags={this.state.tags} fontSize="15px" />}
                            arrow="horizontal">分组</List.Item>

                        <InputItem
                            onChange={this.handleChange.bind(this, 'remark')}
                            value={this.state.remark}
                            placeholder="添加更多备注备注信息">备注</InputItem>
                    </List>

                    <List>
                        <InputItem
                            maxLength={5}
                            onChange={this.handleChange.bind(this, 'height')}
                            type="number"
                            placeholder="填写身高"
                            value={this.state.height}
                            extra="cm">身高</InputItem>

                        <InputItem
                            maxLength={5}
                            onChange={this.handleChange.bind(this, 'weight')}
                            type="number"
                            placeholder="填写体重"
                            value={this.state.weight}
                            extra="kg">体重</InputItem>

                        <List.Item
                            onClick={this.openActionSheet}
                            extra={this.state.marriage ? <span style={{color: '#000'}}>{this.state.marriage}</span> : '请选择'}
                            arrow="horizontal">婚姻</List.Item>

                        <InputItem
                            onChange={this.handleChange.bind(this, 'profession')}
                            value={this.state.profession}
                            placeholder="填写职业">职业</InputItem>
                    </List>

                    <SaveButton isClick={this.state.isClick} onSave={this.saveInfo.bind(this)} />
                </div>
                <div style={this.props.children ? styles.body : styles.hide}>
                    {this.props.children}
                </div>
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
        height: '100%'
    },
};
