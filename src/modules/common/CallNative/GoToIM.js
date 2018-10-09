// 慢病病历--医生端&患者端 跳转到原生IM

var Cordova = require('./../../../cordova/cordova_main.js');
var Go_To_IM = Cordova.go_to_im;


module.exports = function(option, e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    if (e.preventDefault) {
        e.preventDefault();
    }

    var params = {
        orderId: option.orderId,
        messageGroupId: option.messageGroupId,
        doctorName: option.doctorName,
        doctorId: option.doctorId
    };

    try {
        Go_To_IM(params);
    } catch (e) {
        alert(e);
    }
};

