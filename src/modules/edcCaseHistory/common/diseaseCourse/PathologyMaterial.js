// 慢病病历--医生端&患者端 病理资料

var React = require('react');
var Cordova = require('./../../../../cordova/cordova_main.js');
var Call_Pathology_Material = Cordova.call_pathology_material;

var AccordionContainer = require('./../components/AccordionContainer.js');
var BarButton = require('./../components/BarButton.js');
var EmptyData = require('./../components/EmptyData.js');
var Util = require('./../Util.js');
var See_BigPhoto = require('./../../../common/PotoCmp/SeeBigPhoto.js');


module.exports = React.createClass({

    render: function() {
        var type = this.props.type;
        var material = this.props.material;

        var length = material.length;
        var header = <Header type={type} />;
        var footer = length > 0 ? <Footer content={material[0]} /> : <EmptyData />;
        return (
            <div style={{ marginTop: 10, marginBottom: 10 }}>
                <AccordionContainer
                    list={material}
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

var goToAdd = function (materialId) {
    var params = {
        illHistoryInfoId: localStorage.getItem('illHistoryInfoId'),
    };

    if (materialId) {
        params['materialId'] = materialId;
    }

    try {
        Call_Pathology_Material(params, function () {
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
                病理资料
                {
                    this.props.type == 'doctor' &&
                    <BarButton
                        content="添加"
                        onClick={goToAdd.bind(this)} />
                }
            </span>
        );
    }
});

var Content = function (content, index, option) {
    var noEdit = localStorage.getItem('noEdit') || '';
    var imgs = content.imageList || [];
    var length = imgs.length;
    var illHistoryRecordId = content.illHistoryRecordId;
    var text = content.text;
    var imgList = Util.handleImgs(imgs);
    
    return (
        <div>
            <p style={{color: '#999999', fontSize: '15px'}}>
                检查时间：{Util.formatDate(content.checkTime)}
                {
                    !noEdit &&
                    <span style={{color: '#00f', float: 'right', fontSize: '16px'}} onClick={goToAdd.bind(this, illHistoryRecordId)}>编辑</span>
                }
            </p>
            <p>
                {
                    imgs && length > 0 && imgs.map(function (img, index) {
                        return (
                            <img src={Util.transformSmallImg(img.path)} onClick={See_BigPhoto.bind(this, imgList, index)} />
                        );
                    }.bind(this))
                }
            </p>
            {
                text && <p>{text || ''}</p>
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