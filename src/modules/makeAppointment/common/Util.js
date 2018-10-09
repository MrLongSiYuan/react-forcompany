// 公共工具方法

module.exports = {

    // 根据0-6返回星期天至六
    calculateWeekName: function (weekNum) {
        var weekName = '';
        switch (weekNum) {
            case 0:
                weekName = '周天';
                break;
            case 1:
                weekName = '周一';
                break;
            case 2:
                weekName = '周二';
                break;
            case 3:
                weekName = '周三';
                break;
            case 4:
                weekName = '周四';
                break;
            case 5:
                weekName = '周五';
                break;
            case 6:
                weekName = '周六';
                break;
        }
        return weekName;
    },

    // 显示图片缩略图
    transformSmallImg: function (src) {
        return src ? (src + '-small1') : '';
        // return src;
    },

    // 医生端显示进度角标
    showStatus: function (item) {
        var img = '';
        // 预约单状态(2-待确认 3-已确认 5-完成 6-取消)
        switch (item.status) {
            case 2:
                img = 'icon_chapter_waiting@2x.png';
                break;
            case 3:
                img = 'icon_chapter_confirm@2x.png';
                break;
            case 5:
                img = 'icon_chapter_finish@2x.png';
                break;
            case 6:
                img = 'icon_chapter_cancel@2x.png';
                break;
            default:
                img = null;
                break;
        }
        return img ? require('./images/' + img) : '';
    },
};
