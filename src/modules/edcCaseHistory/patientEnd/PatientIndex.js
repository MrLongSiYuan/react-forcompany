// 慢病病历--患者端 患者信息

var React = require('react');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var Flex = AntdMobile.Flex;
var Icon = AntdMobile.Icon;

var Util = require('./../common/Util.js');
var Gender = require('./../common/components/PatientGender.js');

module.exports = React.createClass({

    // 跳转到信息编辑
    goToEdit: function () {
        ReactRouter.hashHistory.pushState({ patientInfo: this.props.patientInfo }, '/edc_patient_edit');
    },

    render: function() {
        var patientInfo = this.props.patientInfo;
        return (
            <Flex style={styles.container} direction="column">
                <div style={{width: '100%'}}>
                    <div style={styles.header}>
                        <span>基本资料</span>

                        <span style={styles.link} onClick={this.goToEdit.bind(this)}>
                                <Icon type="edit" style={{margin: '0 4px'}} />
                                <span>编辑</span>
                            </span>
                    </div>

                    {
                        !Util.compareNullObject(patientInfo, {}) &&
                        <div style={styles.body}>
                            <Flex direction="column">
                                <Flex.Item style={styles.fullWidth}>
                                    <span style={styles.name}>{patientInfo.name}</span>

                                    <Gender sex={patientInfo.sex} ageStr={patientInfo.ageStr} />

                                    <span style={styles.address}>{patientInfo.area}</span>
                                </Flex.Item>

                                {
                                    patientInfo.phone &&
                                        <Flex.Item style={styles.fullWidth}>
                                            手机：{patientInfo.phone}
                                        </Flex.Item>
                                }
                            </Flex>
                        </div>
                    }
                </div>
            </Flex>
        );
    }
});

var styles = {
    container: {
        background: '#fff',
    },
    header: {
        width: '100%',
        padding: '10px 15px',
    },
    link: {
        float: 'right',
        color: '#00b790'
    },
    body: {
        width: '100%',
        padding: '15px',
        borderTop: '1px solid #ccc',
        margin: 0
    },
    fullWidth: {
        margin: 0,
        width: '100%'
    },
    name: {
        marginRight: '13px',
        fontSize: '18px'
    },
    address: {
        color: '#aaa'
    },
};

