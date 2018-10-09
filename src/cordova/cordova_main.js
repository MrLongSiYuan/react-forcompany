function initCordovaJs(callback) {

    var urls = {
        iOS: 'cordova_iOS',
        Andriod: 'cordova_Andriod'
    };

    var url = urls.iOS;

    var agent = navigator.userAgent.toLowerCase();

    if (agent.indexOf('iphone') != -1) {
        url = urls.iOS;
    } else if (agent.indexOf('android') != -1) {
        url = urls.Andriod;
    }

    require('./' + url + '.js');


    document.addEventListener('deviceready', function(rps) {

        if (callback) {
            callback(rps)
        }

    }, false)

}


/**
 *  调用手机相机和图片
 *
 *  callBackfunction 回调函数{'errorCode':1,'errormsg':'错误描述','data':{回调的json数据}}
 *  @return
 */
function call_camera(obj, callback) {


    // cordova.exec(
    //     callBackfunction,
    //     null,
    //     "BridgePlugin",
    //     "call_camera", []);

    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }

        if (rsp && rsp.errorCode != 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    if (cordova && cordova.exec) {
        cordova.exec(
            callBackfunction,
            null,
            "BridgePlugin",
            "call_camera", [json]);
    }
}



/**
 *  查看原图效果
 *
 *  @json {}
 *  @callBackfunction 回调函数{'errorCode':1,'errormsg':'错误描述','data':{回调的json数据}}
 *
 *  @return
 */
function see_bigPhoto(json, callBackfunction, e) {

    if (e && e.stopPropagation) {
        e.stopPropagation();
    }


    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "see_bigPhoto", [json]);
}


/**
 *  上传文件
 *
 *  @jsonstring {'udomain':'七牛空间'，'files':[文件数组]}
 *  @callBackfunction 回调函数{'errorCode':1,'errormsg':'错误描述','data':{回调的json数据}}
 *
 *  @return
 */
function upload_file(json, callBackfunction) {

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "upload_photo", [json]);
}


// 设置按钮
function set_nav_button(obj, callback) {

    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode == 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    if (cordova && cordova.exec) {
        cordova.exec(
            callBackfunction,
            null,
            "BridgePlugin",
            "set_nav_button", [json]);
    }

}

// 播放视频
function open_video(obj, callback) {

    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode == 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    }


    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "open_video", [json]);
}

// 附件
function open_file_page(obj, callback) {

    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode == 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    }

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "open_file_page", [json]);
}

// 设置app消息推送
function Set_My_Message_StateLink(obj, callback) {

    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode == 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "Set_My_Message_StateLink", [json]);
}

// 移除app消息推送
function Remove_My_Message_StateLink(obj, callback) {

    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode == 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "Remove_My_Message_StateLink", [json]);
}

// 消费app消息推送
function Consume_My_Message_State(obj, callback) {

    var json = JSON.stringify(obj);


    var callBackfunction = function(rsp) {

        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }

        if (callback) {
            callback(rsp);
        }
    };

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "Consume_My_Message_State", [json]);
}

// 发长文
function open_long_article_page(obj, callback) {

    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode == 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    }

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "open_long_article_page", [json]);
}

// 跳转原生IM
function go_to_im(obj, callback) {

    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode == 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "go_to_im", [json]);
}

// 调用原生用药记录
function call_medicine_record(obj, callback) {
    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode != 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "call_medicine_record", [json]);
}

// 调用原生医嘱
function call_doctor_advice(obj, callback) {
    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode != 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "call_doctor_advice", [json]);
}

// 调用原生诊断
function call_diagnosis(obj, callback) {
    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode != 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "call_diagnosis", [json]);
}

// 调用原生基础疾病
function call_basic_diseases(obj, callback) {
    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode != 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "call_basic_diseases", [json]);
}

// 调用原生伴随疾病
function call_concomitant_diseases(obj, callback) {
    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode != 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "call_concomitant_diseases", [json]);
}

// 调用原生强制退出
function call_logout(json, callBackfunction, e) {

    if (e && e.stopPropagation) {
        e.stopPropagation();
    }


    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "call_logout", [json]);
}

// 调用原生影像资料
function call_image_material(obj, callback) {
    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode != 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "call_image_material", [json]);
}

// 调用原生病理资料
function call_pathology_material(obj, callback) {
    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode != 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "call_pathology_material", [json]);
}

// 调用原生会诊报告
function call_consultation_report(json, callBackfunction, e) {

    if (e && e.stopPropagation) {
        e.stopPropagation();
    }

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "call_consultation_report", [json]);
}

// 调用原生病情资料
function call_condition_detail(obj, callback) {
    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode != 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "call_condition_detail", [json]);
}

// 调用原生APP支付
function call_app_pay(obj, callback) {
    var json = JSON.stringify(obj);

    var callBackfunction = function(rsp) {
        rsp = JSON.parse(rsp);

        if (rsp && rsp.errorCode == 0) {
            return alert(rsp.errormsg || '');
        }
        if (rsp && rsp.errorCode != 1) {
            return;
        }

        if (callback) {
            callback(rsp);
        }
    };

    cordova.exec(
        callBackfunction,
        null,
        "BridgePlugin",
        "call_app_pay", [json]);
}

//定义大辰Bridge
module.exports = {
    init: initCordovaJs,
    //声明函数-调用手机相机
    call_camera: call_camera,
    //声明函数-查看大图
    see_bigPhoto: see_bigPhoto,
    //声明函数-上传文件
    upload_file: upload_file,
    //声明函数-设置按钮
    set_nav_button: set_nav_button,
    //声明函数-播放视频
    open_video: open_video,
    //声明函数-打开文件页面
    open_file_page: open_file_page,
    //声明函数-设置app消息推送
    Set_My_Message_StateLink: Set_My_Message_StateLink,
    //声明函数-移除app消息推送
    Remove_My_Message_StateLink: Remove_My_Message_StateLink,
    //声明函数-消费app消息推送
    Consume_My_Message_State: Consume_My_Message_State,
    //声明函数-打开长文页面
    open_long_article_page: open_long_article_page,
    //声明函数-跳转原生IM
    go_to_im:　go_to_im,
    //声明函数-调用原生用药记录
    call_medicine_record:　call_medicine_record,
    //声明函数-调用原生医嘱
    call_doctor_advice:　call_doctor_advice,

    //声明函数-调用原生诊断
    call_diagnosis:　call_diagnosis,
    //声明函数-调用原生基础疾病
    call_basic_diseases: call_basic_diseases,
    //声明函数-调用原生伴随疾病
    call_concomitant_diseases: call_concomitant_diseases,
    //声明函数-调用原生强制退出
    call_logout: call_logout,

    //声明函数-调用原生影像资料
    call_image_material: call_image_material,
    //声明函数-调用原生病理资料
    call_pathology_material: call_pathology_material,
    //声明函数-调用原生会诊报告
    call_consultation_report: call_consultation_report,
    //声明函数-调用原生病情资料
    call_condition_detail: call_condition_detail,
    //声明函数-调用原生APP支付
    call_app_pay: call_app_pay,
};
