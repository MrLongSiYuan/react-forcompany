// 慢病病历--医生端&患者端 病情资料

var React = require('react');
var ReactRouter = require('react-router');
var Cordova = require('./../../../../cordova/cordova_main.js');
var Call_Condition_Detail = Cordova.call_condition_detail;

var AccordionContainer = require('./../components/AccordionContainer.js');
var BarButton = require('./../components/BarButton.js');


module.exports = React.createClass({

    render: function () {
        var condition = this.props.condition;
        var currentDiseaseHistory = condition && condition.currentDiseaseHistory ? condition.currentDiseaseHistory : '';
        var header = <Header type={this.props.type} condition={condition} />;
        var footer = <Footer content={currentDiseaseHistory} />;
        return (
            <AccordionContainer list={[condition]} header={header} footer={footer} >
                {Content}
            </AccordionContainer>
        );
    }
});

var Header = React.createClass({

    // 跳转到编辑
    goToEdit: function () {
        try {
            Call_Condition_Detail({
                illHistoryInfoId: localStorage.getItem('illHistoryInfoId')
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
                病情资料
                {
                    this.props.type == 'doctor' &&
                    <BarButton content="编辑" onClick={this.goToEdit.bind(this)} />
                }
            </span>
        );
    }
});

var Content = function (content) {
    return (
        <div className="disease-condition-container">
            <p>现病史：<pre>{content.currentDiseaseHistory}</pre></p>
            <p>既往史：<pre>{content.pastHistory}</pre></p>
            <p>过敏史：<pre>{content.allergyHistory}</pre></p>
            <p>个人史：<pre>{content.personalHistory}</pre></p>
            <p>家族史：<pre>{content.familyHistory}</pre></p>
        </div>
    );
};

var Footer = React.createClass({
    render: function () {
        return (
            <p className="disease-condition-container">现病史：<pre>{this.props.content}</pre></p>
        );
    }
});
