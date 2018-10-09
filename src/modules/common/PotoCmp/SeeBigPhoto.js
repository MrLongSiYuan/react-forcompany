// 慢病病历--医生端&患者端 查看大图

var Cordova = require('./../../../cordova/cordova_main.js');
var See_BigPhoto = Cordova.see_bigPhoto;


// 查看图片
module.exports = function (imgs, index, e) {
    See_BigPhoto({
        files: imgs,
        page: index,
    }, null, e)
};