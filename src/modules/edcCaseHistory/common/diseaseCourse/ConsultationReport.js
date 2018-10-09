// 慢病病历--医生端&患者端 会诊报告

var React = require('react');
var Cordova = require('./../../../../cordova/cordova_main.js');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var Call_Consultation_Report = Cordova.call_consultation_report;
var Button = AntdMobile.Button;

var AccordionContainer = require('./../components/AccordionContainer.js');
var BarButton = require('./../components/BarButton.js');
var EmptyData = require('./../components/EmptyData.js');
var Util = require('./../Util.js');


module.exports = React.createClass({

    render: function() {
        var type = this.props.type;
        var report = this.props.report;

        var length = report.length;
        var header = <Header type={type} />;
        var footer = length > 0 ? <Footer content={report[0]} /> : <EmptyData />;
        return (
            <div style={{ marginTop: 10, marginBottom: 10 }}>
                <AccordionContainer
                    list={report}
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

var goToAdd = function (reportId) {
    var params = {
        reportId: reportId,
    };

    try {
        Call_Consultation_Report(params, function () {
            window.fetchIllHistoryRecords && window.fetchIllHistoryRecords();
        });
    } catch (e) {
        alert(e);
    }
};

var Header = React.createClass({
    render: function () {
        return (
            <span>
                会诊记录
            </span>
        );
    }
});

function makeShowText(obj, key) {
    key = key || 'showText';
    
    return (obj && obj[key]) ? obj[key] : '';
}

var Content = function (content, index, option) {
    var noEdit = localStorage.getItem('noEdit') || '';
    // 会诊订单状态，1进行中，2已结束，3已取消
    var mdtGroupName = content.mdtGroupName;
    var mdtOrderId = content.mdtOrderId;

    var status = content.status;
    var showBtn = (!noEdit && status === 2) ? <span style={{marginLeft:'5px'}}><Button type="ghost" inline size="small" onClick={goToAdd.bind(this, mdtOrderId)}>查看报告</Button></span> : '';
    var firstDiagText = makeShowText(content.firstDiag);

    var report = content.report;
    var checkSuggestText = makeShowText(makeShowText(report, 'checkSuggest'));
    var diagSuggestText = makeShowText(makeShowText(report, 'diagSuggest'));
    var treatSuggestText = makeShowText(makeShowText(report, 'treatSuggest'));

    var targetText = makeShowText(content.target);
    var startTime = content.startTime;
    return (
        <div className="consultation-report-container">
            <p className="display-flex" style={styles.title}>
                <span>MDT小组：</span>
                <span style={{fontSize: '14px'}} className="flex1 word-break">{mdtGroupName}</span>
                {showBtn}
            </p>
            {
                targetText &&
                <p className="display-flex" style={styles.title}>
                    <span>会诊目的：</span>
                    <pre className="flex1">{targetText}</pre>
                </p>
                
            }
            {
                firstDiagText &&
                <p className="display-flex" style={styles.title}>
                    <span>初步诊断：</span>
                    <pre className="flex1">{firstDiagText}</pre>
                </p>
            }
            {
                diagSuggestText &&
                <p className="display-flex" style={styles.title}>
                    <span>诊断意见：</span>
                    <pre className="flex1">{diagSuggestText}</pre>
                </p>
            }
            {
                treatSuggestText &&
                <p className="display-flex" style={styles.title}>
                    <span>治疗意见：</span>
                    <pre className="flex1">{treatSuggestText}</pre>
                </p>
            }
            {
                checkSuggestText &&
                <p className="display-flex" style={styles.title}>
                    <span>其他意见：</span>
                    <pre className="flex1">{checkSuggestText}</pre>
                </p>
            }
            {
                startTime &&
                <p className="display-flex" style={styles.title}>
                    <span>会诊时间：</span>
                    <pre className="flex1">{Util.formatTime(startTime)}</pre>
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

var styles = {
    title: {
        color: '#999999',
        fontSize: '15px'
    }
};