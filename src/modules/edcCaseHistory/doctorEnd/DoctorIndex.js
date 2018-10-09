// 慢病病历--医生端 患者信息

var React = require('react');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var Flex = AntdMobile.Flex;
var Icon = AntdMobile.Icon;

var Tags = require('./PatientTag.js');
var Gender = require('./../common/components/PatientGender.js');
var Util = require('./../common/Util.js');


module.exports = React.createClass({

    // 跳转到信息编辑
    goToEdit: function () {
        ReactRouter.hashHistory.pushState({ patientInfo: this.props.patientInfo }, '/edc_doctor_edit');
    },

    componentWillMount: function () {
        this.noEdit = localStorage.getItem('noEdit') || '';
    },

    render: function() {
        var patientInfo = this.props.patientInfo;
        var noEdit = this.noEdit;
        return (
            <Flex style={styles.container} direction="column">
                <div style={{width: '100%'}}>
                    <div style={styles.header}>
                        <Flex>
                            <div style={styles.imgSize}>
                                <img
                                    style={styles.img}
                                    src={Util.transformSmallImg(patientInfo.headPicFileName)} />
                            </div>
                            <Flex.Item>
                                <Flex direction="column">
                                    <Flex.Item style={styles.title}>
                                        <span style={{
                                            marginRight: patientInfo.remarkName ? '8px' : '0',
                                            fontSize: '16px'
                                        }}>{patientInfo.remarkName}</span>
                                        <span style={styles.name}>{patientInfo.name}</span>

                                        <Gender sex={patientInfo.sex} ageStr={patientInfo.ageStr} />

                                        {
                                            !noEdit && 
                                            <span style={styles.link} onClick={this.goToEdit.bind(this)}>
                                                <Icon type="edit" style={{margin: '0 4px'}} />
                                                <span>编辑</span>
                                            </span>
                                        }
                                    </Flex.Item>
                                    <Flex.Item style={styles.address}>
                                        {patientInfo.area}
                                    </Flex.Item>
                                    <Flex.Item style={styles.fullWidth}>
                                        <Tags tags={patientInfo.tags} fontSize='12px' />
                                    </Flex.Item>
                                </Flex>
                            </Flex.Item>
                        </Flex>
                    </div>
                    <div style={styles.fullWidth}>
                        {
                            patientInfo.remark && <p className="line-clamp" style={styles.remark}>备注：{patientInfo.remark}</p>
                        }
                    </div>
                </div>
            </Flex>
        );
    }
});

var styles = {
    container: {
        padding: '15px',
        background: '#fff',
    },
    header: {
        width: '100%',
        marginBottom: '5px'
    },
    img: {
        height: '70px',
        width: '70px',
        borderRadius: '10px'
    },
    imgSize: {
        height: '70px',
        width: '70px',
    },
    fullWidth: {
        margin: 0,
        width: '100%'
    },
    title: {
        margin: 0,
        width: '100%',
        position: 'relative',
        paddingRight: '50px',
        fontSize: '16px'
    },
    name: {
        color: '#aaa',
        marginRight: '8px',
    },
    link: {
        position: 'absolute',
        top: 0,
        right: 0,
        color: '#9ec3f8'
    },
    address: {
        margin: 0,
        width: '100%',
        color: '#aaa'
    },
    remark: {
        margin: '0',
        fontSize: '15px'
    }
};
