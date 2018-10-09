// 患者 & 医生端--添加检查项目

var React = require('react');
var ReactRouter = require('react-router');
var Moment = require('moment');
var ApiFactory = require('./../../../../cmp/ApiFactory.js');
var Fetch = require('./../../../../fetch/fetch.js');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var List = AntdMobile.List;
var DatePicker = AntdMobile.DatePicker;
var Toast = AntdMobile.Toast;

var Textarea = require('./../components/Textarea.js');
var SaveButton = require('./../components/SaveButton.js');
var PotoCmp = require('./../../../common/PotoCmp/PotoCmp.js');


module.exports = React.createClass({

    getInitialState: function () {
        return {
            checkItem: '',
            date: Moment().locale('zh-cn'),
            maxDate: Moment().locale('zh-cn'),
            pics: [],
            remark: '',
            isClick: false,
        };
    },

    componentDidMount: function() {
        window.setCheckItemFromChildren = this.setCheckItemFromChildren.bind(this);
    },

    // 选择时间
    handleChangeDate: function (date) {
        this.setState({
            date: date
        });
    },

    // 处理TextareaItem输入
    handleChangeContent: function(value) {
        this.setState({
            remark: value
        });
    },

    // 选择检查项目
    selectCheckItem: function (e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }

        ReactRouter.hashHistory.pushState(null, 'edc_add_medical_report/edc_check_item');
    },

    // 选择图片
    selectPhoto: function(imgs) {
        this.setState({
            pics: imgs
        });
    },

    // 保存
    save: function () {
        var state = this.state;

        // if (!state.checkItem) {
        //     Toast.info('请选择检查项');
        //     return ;
        // }
        //
        if (!state.date) {
            Toast.info('请选择时间');
            return ;
        }

        if (state.pics.length == 0) {
            Toast.info('请选择上传检查图片');
            return ;
        }

        if (state.pics.length > 0 && state.pics.indexOf('') > -1) {
            Toast.fail('图片正在上传，请稍后保存');
            return ;
        }

        this.setState({isClick: true});

        var config = {
            url: ApiFactory.caseHistory.addCheckItemByDoctor3,
            data: {
                access_token: localStorage.getItem('access_token'),
                illHistoryInfoId: localStorage.getItem('illHistoryInfoId'),
                // orderId: localStorage.getItem('orderId') || '',
                // checkupId: state.checkItem.id,
                // checkupName: state.checkItem.name,
                // result: state.remark.trim(),
                checkTime: state.date.valueOf(),
                pics: state.pics.toString(),
            }
        };

        Fetch(config)
            .then(function (result) {
                if (result) {
                    Toast.success('添加成功', 3, function () {
                        window.removeIllHistoryRecordsFromStorage();
                        ReactRouter.hashHistory.goBack();
                    }.bind(this));
                }
                this.setState({isClick: false});
            }.bind(this))
            .catch(function () {
                this.setState({isClick: false});
            }.bind(this));
    },

    // 设置children组件的选择病程类型
    setCheckItemFromChildren: function (item) {
        this.setState({
            checkItem: item,
        });
    },

    componentWillUnmount: function () {
        window.setCheckItemFromChildren = null;
    },

    render: function () {
        return (
            <div className="add-check-item scroll-box">
                <div style={this.props.children ? styles.hide : styles.body}>
                    {/*<List style={{margin: '10px 0'}} >*/}
                        {/*<List.Item*/}
                            {/*onClick={this.selectCheckItem.bind(this)}*/}
                            {/*extra={this.state.checkItem ? <span style={{color: '#000'}}>{this.state.checkItem.name}</span> : '请选择'}*/}
                            {/*arrow="horizontal" >*/}
                            {/*检查项*/}
                        {/*</List.Item>*/}

                        <div className="date-picker" style={{marginTop: '10px'}}>
                            <DatePicker
                                mode="date"
                                onChange={this.handleChangeDate.bind(this)}
                                maxDate={this.state.maxDate}
                                value={this.state.date}
                                extra="请选择"
                                title="选择时间" >
                                <List.Item arrow="horizontal">检查时间</List.Item>
                            </DatePicker>
                        </div>
                    {/* </List> */}

                    <div style={styles.wrapper}>
                        <div style={{marginLeft: '10px', marginBottom: '-5px', fontSize: '15px',}}>上传检查图片：</div>
                        <PotoCmp callback={this.selectPhoto.bind(this)} />
                        <p style={{color: '#ccc', fontSize: '12px', marginLeft: '10px'}}>
                            提示：后台转换后将在检查项页面可查看数据
                        </p>
                    </div>

                    {/*<Textarea onChangeContent={this.handleChangeContent.bind(this)}*/}
                              {/*placeholder="填写备注信息" />*/}

                    <SaveButton isClick={this.state.isClick}
                                onSave={this.save.bind(this)} />

                </div>
                <div style={this.props.children ? styles.body : styles.hide}>
                    {this.props.children}
                </div>
            </div>
        );
    },
});

var styles = {
    wrapper: {
        marginTop: '10px',
        background: '#fff',
        padding: '10px 5px'
    },
    container: {
        padding: '10px 15px',
        marginTop: '10px',
        background: '#fff',
        position: 'relative'
    },
    flex: {
        flex: 1,
    },
    hide: {
        display: 'none'
    },
    body: {
        width: '100%',
        height: '100%'
    },
    message: {
        padding: '10px 15px',
        marginTop: '10px',
        background: '#fff',
    },
    img: {
        height: '50px',
        width: '50px',
    },
    fullWidth: {
        margin: 0,
        width: '100%'
    },
};
