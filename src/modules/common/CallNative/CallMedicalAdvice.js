// 慢病病历--医生端&患者端 调用原生医嘱

var Cordova = require('./../../../cordova/cordova_main.js');
var Call_DoctorAdvice = Cordova.call_doctor_advice;


module.exports = function(option, callback) {
    option = option || {};

    try {
        Call_DoctorAdvice(option, callback);
    } catch (e) {
        alert(e);
    }
};

