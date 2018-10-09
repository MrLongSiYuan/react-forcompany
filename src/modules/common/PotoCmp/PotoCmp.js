var React = require('react');
var ReactDOM = require('react-dom');
var DocumentTitle = require('react-document-title');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var Image = require('./../../../antdMobile/image/image.js');
var Flex = AntdMobile.Flex;
var Badge = AntdMobile.Badge;
var Icon = AntdMobile.Icon;
var ActionSheet = AntdMobile.ActionSheet;
var Toast = AntdMobile.Toast;
var ActivityIndicator = AntdMobile.ActivityIndicator;
var Carousel = AntdMobile.Carousel;
var Fetch = require('./../../../fetch/fetch.js');
var Device = require('./../../../device/device.js');
var ApiFactory = require('./../../../cmp/ApiFactory.js');
var Cordova = require('./../../../cordova/cordova_main.js');
var Call_camera = Cordova.call_camera;
var Upload_file = Cordova.upload_file;

var style = {
    body: {
        width: '100%',
        height: '100%'
    },
    width_full: {
        width: '100%'
    },
    hide: {
        display: 'none'
    },
    tabs_img_push: {
        textAlign: 'center',
        float: 'left',
        fontSize: 30,
        lineHeight: '55px',
        width: 55,
        height: 55,
        margin: '10px 20px 10px 0px',
        border: '1px solid #d9d9d9',
        borderRadius: '5px'
    },
    tabs_img_loading: {
        textAlign: 'center',
        float: 'left',
        fontSize: 30,
        lineHeight: '55px',
        width: 55,
        height: 55,
        margin: '10px 20px 10px 0px',
        border: '2px dashed #f8f8f8',
    },
    tabs_img: {
        float: 'left',
        fontSize: 55,
        lineHeight: '55px',
        width: 55,
        height: 55,
        margin: '10px 20px 10px 0px',
        border: '2px solid #d9d9d9',
        overflow: 'initial',
        position: 'relative'
    },
    tabs_img_icon: {
        float: 'left',
        position: 'absolute',
        width: 20,
        height: 20,
        right: -10,
        top: -10,
        // backgroundColor: 'red',
        // color: '#fff',
        backgroundImage: 'url(' + require("./images/delete.png") + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '20px 20px',
        zIndex: 2,
        fontSize: 16,
        lineHeight: '20px',
        borderRadius: 20,
        textAlign: 'center'
    },
};

module.exports = React.createClass({

    getInitialState: function() {

        return {
            selectedImgs: [],
            imgs: [],
            uploading: false,
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.clean) {
            this.cleanPoto();
        }
    },

    funUploadImgs: function() {
        try {


            var _that = this;

            // 将要上传的文件地址
            var files = [];
            for (var i = 0; i < this.state.selectedImgs.length; i++) {
                files.push(this.state.selectedImgs[i].file);
            }

            // 调取原生app上传接口
            Upload_file({
                'udomain': 'patient',
                'files': files
            }, function(rsp) {

                rsp = JSON.parse(rsp);

                // 判断是否上传成功
                if (rsp.errorCode != 1) {
                    _that.setState({
                        uploading: false
                    });
                    return Toast.fail(rsp.errormsg || '上传图片失败');
                }

                // 添加已经上传成功的文件地址
                var imgs = _that.state.imgs.slice();
                for (var i = 0; i < files.length; i++) {

                    // 标记未上传的
                    if (!imgs[i]) {
                        imgs[i] = '';
                    }

                    if (files[i] == rsp.data.file) {
                        imgs[i] = rsp.data.url;
                    }
                }

                _that.setState({
                    imgs: imgs
                });

                // 已全部上传
                if (_that.state.selectedImgs.length == imgs.length && imgs.indexOf('') == -1) {
                    _that.setState({
                        uploading: false
                    })
                }

                if (_that.props.callback) {
                    _that.props.callback(imgs, _that.state.selectedImgs);
                }

            })
        } catch (e) {
            alert(e)
        }
    },

    selectedPoto: function() {
        if (this.state.uploading) {
            return Toast.fail('图片正在上传，请等待');
        }

        try {

            Call_camera({
                'type': 'illHistoryRecords'
            }, function(json) {

                // var data = JSON.parse(json);
                var data = json;

                if (data.errorCode != 1) {
                    return Toast.fail(data.errormsg || '选择图片失败');
                }

                var imgs = this.state.selectedImgs.slice();
                imgs = imgs.concat(data.data);

                if (data.data.length < 1) {
                    return;
                }

                this.setState({
                    selectedImgs: imgs,
                    uploading: true
                });

                setTimeout(function() {
                    this.funUploadImgs();
                }.bind(this), 100);


            }.bind(this))
        } catch (e) {

        }
    },

    removePotp: function(_index, e) {

        if (e && e.stopPropagation) {
            e.stopPropagation();
        }

        if (e && e.preventDefault) {
            e.preventDefault();
        }

        var imgs = this.state.imgs.slice();
        var selectedImgs = this.state.selectedImgs.slice();

        imgs.splice(_index, 1);
        selectedImgs.splice(_index, 1);

        this.setState({
            imgs: imgs,
            selectedImgs: selectedImgs
        });

        if (this.props.callback) {
            this.props.callback(imgs, selectedImgs);
        }

    },

    cleanPoto: function () {
        this.setState({
            selectedImgs: [],
            imgs: [],
            uploading: false,
        });
    },

    render: function() {

        var _data = this.state;

        return (
            <div style={{padding: 10,width:'100%',overflow:'hidden'}}>
                {
                    _data.imgs&&_data.imgs.length>0?_data.imgs.map(function (_img, _index) {
                            return(
                                <div style={style.tabs_img}>
                                    <Image
                                        style={{width:51,height:51,lineHeight:'51px'}}
                                        imgSrc={_img+'-small1'}
                                        imgs={_data.imgs}
                                        index={_index} />
                                    <i style={style.tabs_img_icon} onClick={this.removePotp.bind(this,_index)} />
                                </div>
                            )
                        }.bind(this)):''
                }
                {
                    _data.uploading?(
                            <div style={style.tabs_img_loading} justify="center">
                                <ActivityIndicator size="small"/>
                            </div>
                        ):(
                            <div style={style.tabs_img_push} onClick={this.selectedPoto.bind(this)} justify="center">
                                <Icon style={{color: '#ccc'}} type="plus" />
                            </div>
                        )
                }
            </div>
        )
    }
});
