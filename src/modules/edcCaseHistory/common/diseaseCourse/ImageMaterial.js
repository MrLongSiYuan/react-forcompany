// 慢病病历--医生端&患者端 影像资料

var React = require('react');
var Cordova = require('./../../../../cordova/cordova_main.js');
var Call_Image_Material = Cordova.call_image_material;

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

function goToAdd(materialId, imgType) {
    var params = {
        illHistoryInfoId: localStorage.getItem('illHistoryInfoId'),
    };

    if (materialId) {
        params['materialId'] = materialId;
        params['isWYImage'] = imgType;
    }

    try {
        Call_Image_Material(params, function () {
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
                影像资料
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
    var img = makeDifferentImage(content, this);
    var illHistoryRecordId = content.illHistoryRecordId;
    var imgType = false;
    if (content.type === 10) {
        imgType = true;
    }

    return (
        <div>
            <p style={{color: '#999999', fontSize: '15px'}}>
                检查时间：{Util.formatDate(content.checkTime)}
                {
                    !noEdit &&
                    <span style={{color: '#00f', float: 'right', fontSize: '16px'}} onClick={goToAdd.bind(this, illHistoryRecordId, imgType)}>编辑</span>
                }
            </p>
            <p>{img}</p>
            {
                content.text && <p>{content.text || ''}</p>
            }
        </div>
    );
};

function checkHtmlUrl(url) {
    if (url) {
        window.location.href = url;
    }
}

function setOpenPath(openPath, htmlUrl) {
    window.setTimeout(function () {
        dodo.Thumbnail.load(openPath, document.getElementById(openPath));
    }, 5);

    htmlUrl = htmlUrl + '==?LOSSLESS=';

    return (
        <div>
            <canvas id={openPath} style={{margin: '0 10px 0 0',borderRadius: '5px'}} width="70" height="70" onClick={checkHtmlUrl.bind(this, htmlUrl)} />
            <span style={styles.tips}>提示：本影像为dicom影像文件，点击图像即可查看</span>
        </div>
    );
}

function makeDifferentImage(content, that) {
    var imgType = content.type;
    var openPath = content.openPath;
    var htmlUrl = content.htmlUrl;
    
    // 影像资料（10：微云影像， 9：普通影像）
    if (imgType === 10) {
        var image;
        if (content.status === 30) {
            image = setOpenPath(openPath, htmlUrl);
        } else if (content.status === 20) {
            image = <div>
                        <img src={content.iconUrl} onClick={See_BigPhoto.bind(that, [content.iconUrl], 0)} />
                        <span style={styles.tips}>提示：dicom影像文件正在转换中，请稍后打开病历查看</span>
                    </div>;
        }

        return image;
    } else if (imgType === 9) {
        var imgs = content.imageList || [];
        var length = imgs.length;
        var imgList = Util.handleImgs(imgs);
        return imgs && length > 0 && imgs.map(function (img, index) {
            return (
                <img src={Util.transformSmallImg(img.path)} onClick={See_BigPhoto.bind(that, imgList, index)} />
            );
        }.bind(that));
    }

    return '';
}

var Footer = React.createClass({
    render: function () {
        return (
            Content(this.props.content, 0)
        );
    }
});

var styles = {
    tips: {
        fontSize: '15px',
        color: '#999',
        display: 'inline-block'
    }
};