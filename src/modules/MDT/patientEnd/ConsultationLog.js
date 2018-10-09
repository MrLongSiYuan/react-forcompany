// MDT--患者端 会诊日志

var React = require('react');
var ApiFactory = require('./../../../cmp/ApiFactory.js');
var Fetch = require('./../../../fetch/fetch.js');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var Toast = AntdMobile.Toast;


module.exports = React.createClass({

    getInitialState: function () {
        return {
            logs: [],
        };
    },

    componentDidMount: function () {
        this.getConsultOrderProcessInfo();
    },

    // 请求会诊日志
    getConsultOrderProcessInfo: function () {
        Toast.loading('加载中...', 0);

        var config = {
            url: ApiFactory.mdt.getConsultOrderProcessInfo,
            header: {'access-token': localStorage.getItem('access_token')},
            data: {
                access_token: localStorage.getItem('access_token'),
                orderId: localStorage.getItem('orderId'),
            }
        };
        Fetch(config)
            .then(function (result) {
                if (!result || result.length == 0) {
                    result = [];
                }
                this.setState({
                    logs: result
                });
                Toast.hide();
            }.bind(this))
            .catch(function () {
                Toast.hide();
            });
    },

    render: function() {
        var logs = this.state.logs;
        var length = this.state.logs.length;

        return (
            logs && length > 0 ?
                <div style={{padding: '25px 0 20px 38px', background: '#fff'}}>
                    {
                        logs.map(function (item, index) {
                            var isShow = index != (length - 1);
                            return (
                                <div style={{
                                    padding: '0 0 0 20px',
                                    borderLeft: isShow ? '1px solid #00bf93' : '1px solid #fff',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        height: '30px',
                                        width: '30px',
                                        position: 'absolute',
                                        top: 0,
                                        left: '-15px',
                                        background: '#fff',
                                        borderRadius: '100%'
                                    }} >
                                        <span style={{
                                            height: '10px',
                                            width: '10px',
                                            display: 'inline-block',
                                            position: 'relative',
                                            top: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            background: '#00bf93',
                                            borderRadius: '100%'
                                        }} />
                                    </div>
                                    <div>
                                        <span style={{
                                            fontSize: '12px',
                                            background: '#f2f2f2',
                                            padding: '6px 15px 6px 10px',
                                            borderRadius: '5px',
                                            color: '#aaa',
                                            position: 'relative'
                                        }}>
                                            {item.formateTime}
                                            <span style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '-5px',
                                                transform: 'translateY(-50%)',
                                                zIndex: 1000,
                                                borderRight: '5px solid #f2f2f2',
                                                borderTop: '5px solid transparent',
                                                borderBottom: '5px solid transparent'
                                            }} />
                                        </span>
                                    </div>
                                    <div style={{padding: '12px 10px 0px 0', lineHeight: '16px'}}>
                                        <p style={{fontSize: '15px', color: '#a3a3a3'}}>{item.desc}</p>
                                    </div>
                                    {
                                        isShow &&
                                        <div style={{padding: '15px 0 15px 0'}} >
                                            <p style={{borderBottom: '1px solid #e8e8e8'}} />
                                        </div>
                                    }
                                </div>
                            );
                        }.bind(this))
                    }
                </div>
                :
                <div style={{
                    background: '#fff',
                    textAlign: 'center',
                    padding: '10px'
                }}>
                    暂无数据
                </div>
        );
    }
});
