// 慢病病历--医生端&患者端 检查报告

var React = require('react');
var ReactRouter = require('react-router');

var AccordionContainer = require('./../components/AccordionContainer.js');
var BarButton = require('./../components/BarButton.js');
var EmptyData = require('./../components/EmptyData.js');
var Util = require('./../Util.js');
var See_BigPhoto = require('./../../../common/PotoCmp/SeeBigPhoto.js');


module.exports = React.createClass({

    render: function() {
        var report = this.props.report;
        var length = report.length;
        var header = <Header type={this.props.type} />;
        var footer = length > 0 ? <Footer content={report[0]} /> : <EmptyData />;
        return (
            <AccordionContainer list={report} header={header} footer={footer} >
                {Content}
            </AccordionContainer>
        );
    }
});

var Header = React.createClass({

    // 跳转到新增
    goToAdd: function () {
        ReactRouter.hashHistory.pushState(null, '/edc_add_medical_report');
    },

    render: function () {
        return (
            <span>
                检查报告
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
            <p>检查时间：{Util.formatDate(content.time)}</p>
            {
                content.checkName &&
                <p>检查项：{content.checkName || ''}</p>
            }
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