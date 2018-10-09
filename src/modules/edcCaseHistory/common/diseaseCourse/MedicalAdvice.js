// 慢病病历--医生端&患者端 咨询建议(医嘱)

var React = require('react');
var ReactRouter = require('react-router');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var Flex = AntdMobile.Flex;

var AccordionContainer = require('./../components/AccordionContainer.js');
var BarButton = require('./../components/BarButton.js');
var EmptyData = require('./../components/EmptyData.js');
var Util = require('./../Util.js');
var See_BigPhoto = require('./../../../common/PotoCmp/SeeBigPhoto.js');
var GoTo_IM = require('./../../../common/CallNative/GoToIM.js');
var Call_MedicalAdvice = require('./../../../common/CallNative/CallMedicalAdvice.js');


module.exports = React.createClass({

    render: function() {
        var advice = this.props.advice;
        var length = advice.length;
        var header = <Header isShowButton={this.props.isShowButton} type={this.props.type} />;
        var footer = length > 0 ? <Footer content={advice[0]} /> : <EmptyData />;
        return (
            <AccordionContainer list={advice} header={header} footer={footer} >
                {Content}
            </AccordionContainer>
        );
    }
});

var Header = React.createClass({

    // 跳转到新增
    goToAdd: function () {
        Call_MedicalAdvice({
            orderId: localStorage.getItem('orderId') || '',
            orderType: localStorage.getItem('orderType'),
            doctorId: localStorage.getItem('doctorId'),
            illHistoryInfoId: localStorage.getItem('illHistoryInfoId')
        }, function () {
            window.fetchIllHistoryRecords && window.fetchIllHistoryRecords();
        });
    },

    render: function () {
        return (
            <span>
                咨询建议
                {
                    this.props.type == 'doctor' && (this.props.isShowButton == 1) &&
                    <BarButton
                        content="新增"
                        onClick={this.goToAdd.bind(this)} />
                }
            </span>
        );
    }
});

var Content = function (content) {
    return (
        <div>
            <p>添加时间：{Util.formatDate(content.time)}</p>
            <p>医生：{content.doctorName}</p>
            <p>
                检查项目：
                {
                    content.checkName && content.checkName.length > 0 && content.checkName.map(function (check, index) {
                        return (
                            check + (index == content.checkName.length - 1 ? '' : '，')
                        );
                    }.bind(this))
                }
            </p>
            <Flex align="start" style={{paddingBottom: '.15rem'}}>
                <span style={{lineHeight: '1.5'}}>用药建议：</span>
                <Flex.Item>
                    {
                        content.drugVos && content.drugVos.length > 0 && content.drugVos.map(function (advice) {
                            return (
                                <div>
                                    <div style={{lineHeight: '1.5'}}>{advice.generalName}-{advice.tradeName}</div>
                                    <div style={{color: '#999', fontSize: '13px', lineHeight: '1.1'}}>用法用量：{advice.dosage}</div>
                                </div>
                            );
                        }.bind(this))
                    }
                </Flex.Item>
            </Flex>
            <p>备注：{content.treatAdvise}</p>
            <p>
                {
                    content.pics && content.pics.length > 0 && content.pics.map(function (img, index) {
                        return (
                            <img src={Util.transformSmallImg(img)} onClick={See_BigPhoto.bind(this, content.pics, index)} />
                        );
                    }.bind(this))
                }

            </p>
        </div>
    );
};

var Footer = React.createClass({
    render: function () {
        return (
            Content(this.props.content)
        );
    }
});