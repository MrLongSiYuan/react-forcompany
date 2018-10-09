// 预约--患者端 打开Modal的取消Button组件

var React = require('react');
var AntdMobile = require('./../../../antdMobile/antdMobile.js');
var Button = AntdMobile.Button;
var Modal = AntdMobile.Modal;

var ModalAlert = require('./ModalAlert.js');


module.exports = React.createClass({

    getInitialState: function() {
        return {
            visible: false
        };
    },

    // 打开Modal
    openModal: function (e) {
        if (this.props.phoneNum) {
            e.preventDefault();
            this.setState({
                visible: true,
            });
        } else {
            Modal.alert(this.props.title, this.props.content, [
                { text: this.props.cancelBtnText },
                { text: this.props.okBtnText, onPress: this.ok.bind(this), style: { fontWeight: 'bold' } },
            ]);
        }
    },

    // 确定按钮
    ok: function () {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    },

    // 隐藏Modal
    hideModal: function () {
        this.setState({
            visible: false
        });
    },

    render: function() {
        var props = this.props;
        return (
            <div style={{margin: '15px 0 0 0', textAlign: 'end'}}>
                <Button
                    inline
                    activeStyle={{opacity: 0.8}}
                    style={{height: '0.7rem', fontSize: '15px', lineHeight: '0px', color: '#666', padding: '0.2rem'}}
                    className="btn"
                    onClick={this.openModal.bind(this)}
                >
                    取消预约
                </Button>

                {
                    this.state.visible &&
                    <ModalAlert
                        onCancel={this.hideModal.bind(this)}
                        phoneNum={props.phoneNum}
                        title={props.title}
                        content={props.content}
                        okBtnText={props.okBtnText}
                        cancelBtnText={props.cancelBtnText} />
                }
            </div>
        );
    }
});
