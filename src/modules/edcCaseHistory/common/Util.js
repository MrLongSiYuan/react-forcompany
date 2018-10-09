// 公共工具方法

module.exports = {

    // 格式化时间 year-month-day
    formatDate: function (time) {
        var date = new Date();
        if (time) {
            date.setTime(time);
            date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        } else {
            date = '';
        }

        return date;
    },

    // 格式化时间 year-month-day
    formatTime: function (time) {
        var date = new Date();
        if (time) {
            date.setTime(time);
            date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '  ' + date.getHours() + ':' + date.getMinutes();
        } else {
            date = '';
        }

        return date;
    },

    handleImgs: function (imgs) {
        var newImgs = [];
        
        if (imgs) {
            var length = imgs.length || 0;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    newImgs.push(imgs[i].path);
                }
            }
        }
        return newImgs;
    },

    // 格式化手机号码 XXX****XXXX
    formatPhone: function (phone) {
        if (phone) {
            var regExp = /^(\d{3})(\d{4})(\d{4})/g;
            return phone.replace(regExp, '$1****$3');
        }

        return phone;
    },

    // 判断是否为{}对象
    compareNullObject: function (firstObj, secondObj) {
        return JSON.stringify(firstObj) == JSON.stringify(secondObj);
    },

    // 显示图片缩略图
    transformSmallImg: function (src) {
        return src ? (src + '-small1') : '';
        // return src;
    }
};
