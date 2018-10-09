'use strict';

var ServerRoot = require('./ServerRoot.js');

module.exports = {
    storage: {
        get: function(key) {

            if (!key) return;

            var _storage = localStorage.getItem(key);
            if (_storage) {
                _storage = JSON.parse(_storage);
            } else {
                _storage = null;
            }
            return _storage;
        },
        set: function(key, storage) {
            if (!key) return;
            localStorage.setItem(key, JSON.stringify(storage));
            return this.get(key);
        },
        token: function(_token) {
            if (_token) {
                localStorage.setItem('communityToken', _token);
            }
            return localStorage.getItem('communityToken') || null;
        },
        user: function(userData) {
            if (userData) {
                localStorage.setItem('communityUserJSON', JSON.stringify(userData));
            }
            var _userData = localStorage.getItem('communityUserJSON');
            if (_userData) {
                _userData = JSON.parse(_userData);
            } else {
                _userData = null;
            }
            return _userData;
        },
        groups: function(groupData) {
            if (groupData) {
                localStorage.setItem('communityGroupsJSON', JSON.stringify(groupData));
            }
            var _groupData = localStorage.getItem('communityGroupsJSON');
            if (_groupData) {
                _groupData = JSON.parse(_groupData);
            } else {
                _groupData = null;
            }
            return _groupData;
        }
    },
    appointment: {
        getAppointmentDoctorList:  ServerRoot.serverApiRoot + 'appointment/getAppointmentDoctorList',   // 获取医生端预约列表
        submitAppointmentDoctor:  ServerRoot.serverApiRoot + 'appointment/submitAppointmentDoctor',     // 医生端提交预约单
        updateStatus:  ServerRoot.serverApiRoot + 'appointment/updateStatus',     // 医生端修改状态
        updateCheckTime:  ServerRoot.serverApiRoot + 'appointment/updateCheckTime',     // 医生端修改预约时间
        addCheckPicture:  ServerRoot.serverApiRoot + 'appointment/addCheckPicture',     // 医生端上传图片
        webCancel:  ServerRoot.serverApiRoot + 'appointment/webCancel',     // 医生端取消预约单
        getAppointmentById:  ServerRoot.serverApiRoot + 'appointment/getAppointmentById',   // 获取医生端和患者端预约单详细信息
        getAppointmentList:  ServerRoot.serverApiRoot + 'appointment/getAppointmentList',   // 获取患者端预约列表
        submitAppointment:  ServerRoot.serverApiRoot + 'appointment/submitAppointment',     // 患者端提交预约单
        cancel:  ServerRoot.serverApiRoot + 'appointment/cancel',       // 患者端取消预约单
        balance:  ServerRoot.serverApiRoot + 'appointment2/balance',       // 患者端获取用户剩余的预约次数
        createAppointmentRechargeOrder:  ServerRoot.serverApiRoot + 'order3/createAppointmentRechargeOrder',       // 创建充值订单-预约次数
    },
    caseHistory: {
        patientInfo:  ServerRoot.serverApiRoot + 'pack/indicator/patientInfo',      // 获取患者基本信息
        editPatientInfo:  ServerRoot.serverApiRoot + 'pack/illHistory/editPatientInfo',      // 编辑患者信息
        getPatientTags:  ServerRoot.serverApiRoot + 'doctor/getPatientTags',     // 医生获取历史标签
        getIllHistroyRecords:  ServerRoot.serverApiRoot + 'pack/illHistory/getIllHistroyRecords',    // 获取病程信息
        getIllHistroyRecords_new:  ServerRoot.illHistoryApiRoot + 'anno/',    // 获取病程信息（new）
        getIllHistoryRecordTypes:  ServerRoot.serverApiRoot + 'pack/illHistory/getIllHistoryRecordTypes',    // 获取检查项列表
        addCheckItemByDoctor:  ServerRoot.serverApiRoot + 'pack/illHistory/addCheckItemByDoctor',    // 添加检查项
        addCheckItemByDoctor3:  ServerRoot.serverApiRoot + 'checkBill/addCheckItemByDoctor3',    // 添加检查项(new)
        editIllContentInfo:  ServerRoot.serverApiRoot + 'pack/illHistory/editIllContentInfo',   // 编辑病情资料
        addDiagnosis:  ServerRoot.serverApiRoot + 'pack/illHistory/addDiagnosis',   // 添加诊断
        upDiagnosis:  ServerRoot.serverApiRoot + 'pack/illHistory/upDiagnosis',     // 诊断顺序上移
        findDiseaseByName: ServerRoot.serverApiRoot + '/diseaseType/findByName' // 根据病种名查找病种（支持模糊查询）
    },
    mdt: {
        getConsultOrderProcessInfo: ServerRoot.mdtApiRoot + 'edc/getConsultOrderProcessInfo',   // 按照时间升序查找看某个订单对应的日志信息
    },
    inviteDoctor: {
        createDoctor: ServerRoot.serverApiRoot + 'anno/doctor',   // 创建医生账号
        getDoctor: ServerRoot.serverApiRoot + 'anno/doctor/',   // 获取医生详情
        getSmsCode: function (phone) {
            return ServerRoot.serverApiRoot + 'anno/doctor/sms/' + phone + '/register'
        }   // 获取注册验证码
    }
};
