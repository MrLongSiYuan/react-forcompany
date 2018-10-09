// 慢病病历--医生端&患者端 调用原生用药记录

var Cordova = require('./../../../cordova/cordova_main.js');
var Call_MedicineRecord = Cordova.call_medicine_record;


module.exports = function(option, callback) {
    option = option || {};

    try {
        Call_MedicineRecord(option, callback);
    } catch (e) {
        alert(e);
    }
};

