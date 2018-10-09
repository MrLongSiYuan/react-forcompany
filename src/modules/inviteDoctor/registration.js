// 邀请医生-- 医生注册

var React = require('react');
var ApiFactory = require('./../../cmp/ApiFactory.js');
var Fetch = require('./../../fetch/fetch.js');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
var Toast = AntdMobile.Toast;
var Button = AntdMobile.Button;
var InputItem = AntdMobile.InputItem;

require('./style.css')

var successIcon = require('./images/successful.svg');
var logo = require('./images/logo.png');
var banner = require('./images/banner.png');
var unvisible = require('./images/unvisible.svg');
var visible = require('./images/visible.svg');


module.exports = React.createClass({

    getInitialState: function () {
        return {
            name:'',
            telephone: '',
            password: '',
            code: '',
            isVisible: false,
            showResult: false,
            doctor: {
                id: '',
                headPic: '',
                name: ''
            },
            count: 0
        };
    },
    componentDidMount: function () {
        this.getDoctorInfo();
        this.GET_CODE_AFTER_X_SECONDS = 60;
    },
    getDoctorInfo: function () {
        var params = this.props.params || {},
            doctorId = params.doctorId;
        
        var config = {
            type: 'GET',
            url: ApiFactory.inviteDoctor.getDoctor + doctorId,
        };

        Fetch(config)
            .then(function (result) {
                this.setState({
                    doctor: {
                        id: result.userId,
                        headPic: result.headPicFileName,
                        name: result.name || ''
                    }
                })
            }.bind(this))
            .catch(function (err) {
                console.log(err)
            });
    },
    handleClick: function () {
        if (!this.state.password) {
            return ;
        }
        
        this.setState({
            isVisible: !this.state.isVisible
        })
    },
    handleName: function (value) {
        this.setState({
            name: value
        })
    },
    handlePassword: function (value) {
        this.setState({
            password: value
        })
    },
    handleTelephone: function (value) {
        this.setState({
            telephone: value
        })
    },
    handleCode: function (value) {
        this.setState({
            code: value
        })
    },
    formatPhone: function (phone) {
        return phone ? phone.replace(/\s/g, '') : ''
    },
    getCode: function () {
        var telephone = this.state.telephone || '';
            telephone = this.formatPhone(telephone);
        if (!telephone) {
            Toast.info('请输入手机号');
            return ;
        }

        if (telephone.length != 11 || telephone[0] != 1) {
            Toast.info('请输入正确手机号');
            return ;
        }

        var config = {
            type: 'GET',
            url: ApiFactory.inviteDoctor.getSmsCode(telephone)
        };

        Fetch(config)
            .then(function (result) {
                if (!result) {
                    return ;
                }
                
                this.setState({
                    count: result
                })

                var self = this
                this.timer = window.setInterval(function () {
                    var count = self.state.count

                    if (!count) {
                        window.clearInterval(self.timer)
                    } else {
                        self.setState({
                            count: --count
                        })
                    }
                }, 1000)
            }.bind(this))
            .catch(function (err) {
                console.log(err)
            });
    },
    onSubmit: function () {
        var state = this.state
        var doctor = state.doctor
        
        var config = {
            url: ApiFactory.inviteDoctor.createDoctor,
            header: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            data: JSON.stringify({
                inviterId: doctor.id,
                name:state.name,   
                password: state.password,
                telephone: this.formatPhone(state.telephone),
                validateCode: state.code
            })
        };

        Fetch(config)
            .then(function (result) {
                if (result) {
                    this.setState({
                        showResult: true
                    })
                }
            }.bind(this))
            .catch(function (err) {
                console.log(err)
            });
    },
    render: function() {
        var state = this.state;
        var doctor = state.doctor || {};
        var isVisible = state.isVisible;
        var count = state.count;
        var showResult = state.showResult;
        var canSubmit = !state.telephone || (state.telephone.length != 13) || !state.password || !state.code || !state.name;

        return (
            <div className="invite_doctor" style={{height: '100%', background:' #426EC5', overflowY: 'auto'}}>
                {
                    showResult ? 
                        <section  style={{height: '100%', background:' #fff', position: 'relative', paddingTop: '100px'}}>
                            <section style={{textAlign: 'center'}}>
                                <img style={{height: '83px', width: '83px'}} src={successIcon} alt="successful"/>
                                <h3 style={styles.resultTitle}>注册成功</h3>
                                <p style={styles.resultInfo}>请登录医加多APP完善医生资料</p>
                            </section>
                            <section style={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                height: '75px',
                                borderTop: '1px solid #E3E2E2',
                                padding: '15px'
                            }}>
                                <img style={{height: '40px', width: '40px'}} src={logo} alt="医加多"/>
                                <span style={{
                                    width: '60%',
                                    display: 'inline-block',
                                    height: '40px',
                                    verticalAlign: 'top',
                                    lineHeight: '40px',
                                    marginLeft: '15px'
                                }}>医加多医生端</span>
                                <span style={{
                                    display: 'inline-block',
                                    height: '40px',
                                    verticalAlign: 'top',
                                    lineHeight: '40px',
                                }}>
                                    <a style={{background: '#6A93E0', borderRadius: '4px', color: '#fff', padding: '.1rem .12rem', fontSize: '.24rem'}} href="http://android.myapp.com/myapp/detail.htm?apkName=com.dachen.mdtdoctor&ADTAG=mobile">立即下载</a>
                                </span>
                            </section>
                        </section>

                        :

                        <section style={{position: 'relative', paddingBottom: '20px'}}>
                            <section style={{background: 'url(' + banner +') no-repeat', backgroundSize: '100% 100%', width: '100%', position: 'relative', padding: '95px 0 20px'}}>
                                <div style={{textAlign: 'center'}}>
                                    <p style={{marginBottom: '2px', fontSize: 0}}>
                                        <img style={{width: '40px', height: '40px', borderRadius: '50%'}} src={doctor.headPic} alt="头像"/>
                                    </p>
                                    <p style={{fontSize: '12px', color: '#FFFFFF', lineHeight: '15px'}}>{doctor.name}</p>
                                    <div style={{margin: '10px 15px 0', background: '#6A93E0', borderRadius: '100px', padding: '10px 15px'}}>
                                        <p style={{fontSize: '12px', color: '#FFFFFF', lineHeight: '15px'}}>医加多线上MDT会诊和随访管理平台——邀名医入百姓家</p>
                                        <p style={{fontSize: '12px', color: '#FFFFFF', lineHeight: '15px', marginTop: '5px'}}>我在这个平台开展线上MDT会诊和随访管理</p>
                                    </div>
                                </div>
                            </section>

                            <section style={{background: '#fff', margin:' 0 15px', padding: '20px 15px 20px', textAlign: 'center'}}>
                                <h3 style={{fontSize: '20px', color: '#333', lineHeight: '20px'}}>注册医加多</h3>
                                
                                <div style={{ marginTop: '10px' }}>
                                    <InputItem onChange={this.handleName} value={state.name} type="text" placeholder="请输入您的姓名"></InputItem>
                                </div>

                                <div style={{marginTop: '10px'}}>
                                    <InputItem onChange={this.handleTelephone} value={state.telephone} type="phone" placeholder="请输入手机号作为登录账号"></InputItem>
                                </div>
                                <div style={{marginTop: '10px', position: 'relative'}}>
                                    <InputItem type={ isVisible ? 'text' : 'password'} value={state.password} onChange={this.handlePassword} placeholder="请输入密码"></InputItem>
                                    <img style={{
                                        position: 'absolute',
                                        right: '40px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        MsTransform: 'translateY(-50%)',
                                        MozTransform: 'translateY(-50%)',
                                        WebkitTransform: 'translateY(-50%)',
                                        OTransform: 'translateY(-50%)'}} src={isVisible ? unvisible : visible} onClick={this.handleClick}/>
                                </div>
                                <div className="code" style={{marginTop: '10px', position: 'relative'}}>
                                    <InputItem onChange={this.handleCode} value={state.code} placeholder="请输入短信验证码"></InputItem>
                                    <Button style={{
                                        background: '#6A93E0',
                                        borderRadius: '29px',
                                        color: '#fff',
                                        position: 'absolute',
                                        width: '40%',
                                        height: '46px',
                                        fontSize: '14px',
                                        lineHeight: '16px',
                                        right: '15px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        MsTransform: 'translateY(-50%)',
                                        MozTransform: 'translateY(-50%)',
                                        WebkitTransform: 'translateY(-50%)',
                                        OTransform: 'translateY(-50%)'
                                    }} onClick={this.getCode} disabled={count} activeStyle={{opacity: '.8'}}>{count ? (count + 's后可重发') : '获取验证码'}</Button>
                                </div>
                                
                                <div style={{margin: '20px 52px 0'}}>
                                    <Button disabled={canSubmit} onClick={this.onSubmit} style={{background: canSubmit ? '#ddd' : '#45C5A8', borderRadius: '29px', color: '#fff'}} activeStyle={{opacity: '.8'}}>注册</Button>
                                </div>
                            </section>
                        </section>
                }
            
            </div>
        );
    }
});

var styles = {
    doctorInfo: {
        textAlign: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        MsTransform: 'translate(-50%,-50%)',
        MozTransform: 'translate(-50%,-50%)',
        WebkitTransform: 'translate(-50%,-50%)',
        OTransform: 'translate(-50%,-50%)'
    },
    resultTitle: {
        fontSize: '20px',
        color: '#333',
        lineHeight: '20px',
        margin: '15px 0 10px',
    },
    resultInfo: {
        fontSize: '16px',
        color: '#666',
        lineHeight: '16px'
    }
}
