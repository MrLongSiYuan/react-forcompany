// 慢病病历--患者端 患者编辑

var React = require('react');
var ReactRouter = require('react-router');
var ApiFactory = require('./../../../cmp/ApiFactory.js');
var Fetch = require('./../../../fetch/fetch.js');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var List = AntdMobile.List;
var InputItem = AntdMobile.InputItem;
var Toast = AntdMobile.Toast;
var ActionSheet = AntdMobile.ActionSheet;

var SaveButton = require('./../common/components/SaveButton.js');


module.exports = React.createClass({

    getInitialState: function() {
        var patientInfo = this.props.location.state && this.props.location.state.patientInfo || {};
        return {
            name: patientInfo.name || '',
            idCard: patientInfo.idCard || '',
            gender: patientInfo.sex || '',
            age: patientInfo.ageStr || '',
            address: patientInfo.area || '',
            telephone: patientInfo.phone || '',
            height: patientInfo.height || '',
            weight: patientInfo.weight || '',
            marriage: patientInfo.marriage || '',
            profession: patientInfo.job || '',
            isClick: false
        };
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

    // 保存编辑信息
    saveInfo: function () {
        this.setState({isClick: true});
        var state = this.state;

        // if (!this.checkIDNumber(state.idCardNumber)) {
        //     this.setState({isClick: false});
        //     return ;
        // }

        var config = {
            url: ApiFactory.caseHistory.editPatientInfo,
            data: {
                access_token: localStorage.getItem('access_token'),
                // doctorId: localStorage.getItem('doctorId'),
                // patientId: localStorage.getItem('patientId'),
                illHistoryInfoId: localStorage.getItem('illHistoryInfoId'),
                name: state.name,
                idCard: state.idCard,
                sex: state.gender,
                age: state.age,
                area: state.address,
                phone: state.telephone,
                height: state.height,
                weight: state.weight,
                marriage: state.marriage,
                job: state.profession.trim()
            }
        };
        Fetch(config)
            .then(function (result) {
                if (result) {
                    Toast.success('编辑成功', 3, function () {
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

    // 处理所有Input输入
    handleChange: function(key, value) {
        var temp = {};
        temp[key] = value;
        this.setState(temp);
    },

    // // 校验身份证号码
    // checkIDNumber: function(idCardNumber) {
    //     if (!idCardNumber) {
    //         Toast.info('身份证号码不能为空');
    //         return false;
    //     }
    //
    //     if (idCardNumber.length != 18) {
    //         Toast.info('身份证号码长度不符合');
    //         return false;
    //     }
    //
    //     var regExp = /^[1-9]\d{16}[\dX]$/i;
    //     if (!regExp.test(idCardNumber)) {
    //         Toast.info('身份证号码输入有误');
    //         return false;
    //     }
    //
    //     return true;
    // },

    // // 过滤结果为数字、数字+x
    // filterNotIDNumber: function (value) {
    //     var regExp = /^[^1-9]|[^xX\d]+/;
    //     value = value.replace(regExp, '');
    //     this.setState({
    //         idCardNumber: value
    //     });
    // },

    componentWillUnmount: function () {
        this.closeActionSheet();
    },

    render: function() {
        return (
            <div className="patient-info-edit scroll-box">
                <List>
                    <div className="patient-extra-color">
                        <List.Item
                            extra={this.state.name}>
                            姓名
                        </List.Item>

                        {/*<InputItem*/}
                            {/*maxLength={18}*/}
                            {/*onChange={this.filterNotIDNumber.bind(this)}*/}
                            {/*placeholder="填写身份证号码"*/}
                            {/*value={this.state.idCardNumber}>身份证</InputItem>*/}

                        <List.Item
                            extra={this.state.idCard}>
                            身份证
                        </List.Item>

                        <List.Item
                            extra={this.state.gender == 1 ? '男' : '女'}>
                            性别
                        </List.Item>

                        <List.Item
                            extra={this.state.age}>
                            年龄
                        </List.Item>

                        <List.Item
                            extra={this.state.address}>
                            常住地
                        </List.Item>

                        <List.Item
                            extra={this.state.telephone}>
                            手机号
                        </List.Item>
                    </div>

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
        );
    }
});
