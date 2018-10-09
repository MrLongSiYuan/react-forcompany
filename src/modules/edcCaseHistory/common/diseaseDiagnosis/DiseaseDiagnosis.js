// 慢病病历--医生端&患者端 疾病诊断

var React = require('react');
var Cordova = require('./../../../../cordova/cordova_main.js');
var Call_Diagnosis = Cordova.call_diagnosis;

var AccordionContainer = require('./../components/AccordionContainer.js');
var BarButton = require('./../components/BarButton.js');
var EmptyData = require('./../components/EmptyData.js');
var Util = require('./../Util.js');


module.exports = React.createClass({

    render: function() {
        var type = this.props.type;
        var data = this.props.diagnosis;
        var diagnosis = data.array && data.array.length > 0 ? data.array.slice() : [];
        if (data.text) {
            diagnosis.push({
                name: '备注：' + data.text
            });
        }
        var length = diagnosis.length;
        var header = <Header diagnosis={data} type={type} />;
        var footer = length > 0 ? <Footer content={diagnosis[0]} /> : <EmptyData />;
        return (
            <div style={{ marginTop: 10, marginBottom: 10 }}>
                <AccordionContainer
                    list={diagnosis}
                    header={header}
                    footer={footer}
                    option={{
                        type: type,
                    }}
                >
                    {Content}
                </AccordionContainer>
            </div>
        );
    }
});

var Header = React.createClass({

    // 跳转到新增
    goToAdd: function () {
        try {
            Call_Diagnosis({
                diagnosisId: localStorage.getItem('planDiseaseTypeId'),
                data: this.props.diagnosis,
                medicalRecordId: localStorage.getItem('illHistoryInfoId')
            }, function () {
                window.fetchIllHistoryRecords && window.fetchIllHistoryRecords();
            });
        } catch (e) {
            alert(e);
        }
    },

    render: function () {
        return (
            <span>
                诊断
                {
                    this.props.type == 'doctor' &&
                    <BarButton
                        content="编辑"
                        onClick={this.goToAdd.bind(this)} />
                }
            </span>
        );
    }
});

var Content = function (content, index, option) {
    return (
        <div>
            <p style={{paddingBottom: 0}}>
                {content.name}
                {
                    content.array && content.array.length > 0 && ( '(' +
                        content.array.map(function (item) {
                            return item.name;
                        }) + ')')
                }
            </p>
            {
                content.diagnosisTime &&
                <p style={{padding: '0 .1rem 0 0.3rem', color: '#666', fontSize: '13px'}}>
                    诊断时间：
                    {Util.formatDate(content.diagnosisTime)} ~ {content.endTime ? Util.formatDate(content.endTime) : '持续中'}
                </p>
            }
        </div>
    );
};

var Footer = React.createClass({
    render: function () {
        return (
            Content(this.props.content, 0)
        );
    }
});