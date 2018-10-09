'use strict';
// hack 华为荣耀6 fetch Promise is not defined
require('es6-promise');
require('whatwg-fetch');
var Cordova = require('./../cordova/cordova_main.js');
var Call_Logout = Cordova.call_logout;

function _objToParamUrl(obj) {
    // obj 转成 参数url
    var bodyStr = '';
    for (var key in obj) {
        if (bodyStr != '') {
            bodyStr += '&';
        }
        bodyStr += key + '=' + encodeURIComponent(obj[key]);
    }

    return bodyStr;
};

function _fetch(config, loading) {

    if (!config.url) {
        return console.warn('缺少请求地址url');
    }
    
    var bodyStr;
    var headers = config.header || {};
    
    if (headers && headers['Content-Type']) {
        bodyStr = config.data
    } else {
        bodyStr = _objToParamUrl(config.data);
    }
    headers['Content-Type'] = headers['Content-Type'] || 'application/x-www-form-urlencoded;charset=utf-8';
    
    var params = {
        method: config.type || 'POST',
        headers: headers,
    };

    if (bodyStr) {
        params['body'] = bodyStr;
    }

    var _fetch = fetch(
            config.url, params)
        .then(function(_response) {

            return _response.json();

        }).then(function(_rps) {

            if (config.noDeal) {
                return _rps;
            }
            if (_rps && _rps.resultCode == 1) {
                return (_rps.data === null || _rps.data === undefined) ? true : _rps.data;
            }
            if (_rps && _rps.resultMsg) {
                alert(_rps.resultMsg);

                if (_rps.resultCode = 1030102) {
                    try {
                        Call_Logout({}, function () {
                            
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }
                
                return null;
            }

        }).catch(function(ex) {
        
            console.log('接口出错', ex)
        });

    return _fetch;

};

module.exports = _fetch;
