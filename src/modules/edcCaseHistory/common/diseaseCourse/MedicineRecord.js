// 慢病病历--医生端&患者端 用药记录

var React = require('react');

var AccordionContainer = require('./../components/AccordionContainer.js');
var BarButton = require('./../components/BarButton.js');
var EmptyData = require('./../components/EmptyData.js');
var Util = require('./../Util.js');
var Call_MedicineRecord = require('./../../../common/CallNative/CallMedicineRecord.js');


module.exports = React.createClass({

    render: function() {
        var record = this.props.record;
        var length = record.length;
        var header = <Header type={this.props.type} />;
        var footer = length > 0 ? <Footer content={record[0]} /> : <EmptyData />;
        return (
            <AccordionContainer list={record} header={header} footer={footer} >
                {Content}
            </AccordionContainer>
        );
    }
});

var Header = React.createClass({

    // 跳转到新增
    goToAdd: function () {
        Call_MedicineRecord({
            orderId: localStorage.getItem('orderId') || '',
            illHistoryInfoId: localStorage.getItem('illHistoryInfoId')
        }, function () {
            window.fetchIllHistoryRecords && window.fetchIllHistoryRecords();
        });
    },

    render: function () {
        return (
            <span>
                用药记录
                {
                    this.props.type == 'doctor' &&
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
            {
                content.drugInfos && content.drugInfos.length > 0 && content.drugInfos.map(function (drug) {
                    return (
                        <div style={{marginBottom: '5px'}}>
                            <p style={{padding: 0}}>{drug.drugName}</p>
                            <div
                                style={{
                                    color: '#666',
                                    fontSize: '14px',
                                    lineHeight: '1.5',
                                    marginBottom: '3px',
                                    wordWrap: 'break-word',
                                    whiteSpace: 'normal'
                                }}>{drug.usage}</div>
                            <div style={{padding: '0 .1rem 0 0.3rem', color: '#999', fontSize: '13px', lineHeight: '1.1'}}>
                                用药时间：
                                {Util.formatDate(drug.time)} ~ {drug.endTime ? Util.formatDate(drug.endTime) : '持续中'}
                            </div>
                        </div>
                    );
                }.bind(this))
            }
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

