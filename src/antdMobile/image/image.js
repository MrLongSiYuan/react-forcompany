'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var AntdMobile = require('./../antdMobile.js');
var ActivityIndicator = AntdMobile.ActivityIndicator;
var Flex = AntdMobile.Flex;
var Cordova = require('./../../cordova/cordova_main.js');
var See_bigPhoto = Cordova.see_bigPhoto;

var style = {
    img: {
        width: '100%',
        height: '100%'
    },
    img_no: {
        display: 'none'
    },
};


module.exports = React.createClass({
    getInitialState: function() {
        return {
            url: this.props.imgSrc || '',
            loading: true
        }
    },
    componentWillReceiveProps:function (_props) {
        this.setState({
            url: _props.imgSrc || '',
        })
    },
    imgOnLoad: function() {
        this.setState({
            loading: false
        })
    },

    seeBigPoto: function(_imgs, _index, e){
        See_bigPhoto({
            files: _imgs,
            page: _index,
        }, null, e)
    },

    render: function() {
        return (
            <span style={this.props.style}>
                    <img
                        style={this.state.loading?style.img_no:style.img}
                        src={this.state.url} alt=""
                        onLoad={this.imgOnLoad.bind(this)}
                        onClick={this.seeBigPoto.bind(this, this.props.imgs, this.props.index)} />
                {
                    this.state.loading?(
                        <Flex justify="center" direction="column" style={{height:'100%'}}>
                            <Flex>
                                <ActivityIndicator size={this.props.size||'large'}/>
                            </Flex>
                        </Flex>
                        ):''
                }
            </span>
        )
    }
});
