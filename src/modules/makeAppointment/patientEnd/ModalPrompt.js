// 预约--患者端 打开Modal的取消Button组件

var React = require('react');


module.exports = React.createClass({

    getInitialState: function() {
        return {
            type: '',
            value: '',
            defaultValue: '',
            title:　'',
            maxLength: 10,
            visible: false
        };
    },

    cancelBtn: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        if (event.preventDefault) {
            event.preventDefault();
        }
        this.hideModal();
    },

    okBtn: function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        if (event.preventDefault) {
            event.preventDefault();
        }

        if (this.props.onChangeInfo) {
            this.props.onChangeInfo(this.state.type, this.state.value || this.state.defaultValue);
        }
        this.hideModal();
    },

    // 隐藏Modal
    hideModal: function () {
        this.setState({
            visible: false
        });
    },

    // 显示Modal
    showModal: function (obj) {
        this.setState({
            type: obj.type,
            value: obj.value,
            defaultValue: obj.value,
            title:　obj.title,
            maxLength: obj.maxLength,
            visible: true
        });
    },

    // 处理input输入值
    changeValue: function (event) {
        if (this.state.type == 'patientTel') {
            event.target.value = event.target.value.replace(/^[^1]|\D*$/g, '');
        }
        this.setState({
            value: event.target.value
        });
    },

    render: function() {
        var state = this.state;
        return (
            this.state.visible &&
                <div className="my-modal-prompt">
                    <div style={styles.mask}></div>
                    <div style={styles.wrap}>
                        <div style={{width: '5.4rem', height: 'auto', position: 'relative'}}>
                            <div style={styles.content}>
                                <div style={styles.header}>
                                    <div style={styles.title}>
                                        {state.title}
                                    </div>
                                </div>
                                <div style={styles.body}>
                                    <div style={{zoom: 1, overflow: 'hidden'}}>
                                        <div style={styles.input}>
                                            <input
                                                style={{
                                                    border: 0,
                                                    width: '98%',
                                                    webkitBoxSizing: 'border-box',
                                                    margin: 0,
                                                    padding: '.06rem 0',
                                                }}
                                                maxLength={state.maxLength}
                                                onChange={this.changeValue.bind(this)}
                                               type="text" value={this.state.value} />
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.footer}>
                                    <a style={styles.cancelButton} href="#" onClick={this.cancelBtn.bind(this)}>取消</a>
                                    <a style={styles.okButton} href="#" onClick={this.okBtn.bind(this)}>确定</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
});

var styles = {
    mask: {
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        height: '100%',
        zIndex: '999',
        backgroundColor: 'rgba(0,0,0,.8)',
    },
    wrap: {
        position: 'fixed',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        WebkitTransform: 'translateX(-50%)',
        zIndex: '999',
        overflow: 'auto',
        outline: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        position: 'relative',
        backgroundColor: '#fff',
        border: 0,
        backgroundClip: 'padding-box',
        textAlign: 'center',
        overflow: 'hidden',
        borderRadius: '.14rem',
        height: 'auto',
        paddingTop: '.3rem',
    },
    header: {
        padding: '.12rem .3rem .3rem'
    },
    title: {
        margin: 0,
        fontSize: '.34rem',
        lineHeight: 1,
        color: '#000',
        textAlign: 'center',
    },
    body: {
        fontSize: '.26rem',
        color: '#333',
        height: '100%',
        overflow: 'auto',
        padding: '0 .3rem .3rem',
    },
    input: {
        borderBottomLeftRadius: '.06rem',
        borderBottomRightRadius: '.06rem',
        marginTop: '.18rem',
        borderTop: '1px solid #ddd',
        borderTopLeftRadius: '.06rem',
        borderTopRightRadius: '.06rem',
        borderLeft: '1px solid #ddd',
        borderRight: '1px solid #ddd',
        borderBottom: '1px solid #ddd',
    },
    footer: {
        borderTop: '1px solid #ddd',
        display: '-webkit-box',
        display: '-webkit-flex',
        display: 'flex',
    },
    cancelButton: {
        borderRight: '1px solid #ddd',
        boxSizing: 'border-box',
        textAlign: 'center',
        outline: 'none',
        color: '#000',
        fontSize: '.32rem',
        height: '1rem',
        lineHeight: '1rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        width: '50%',
    },
    okButton: {
        boxSizing: 'border-box',
        textAlign: 'center',
        outline: 'none',
        color: '#108ee9',
        fontSize: '.32rem',
        height: '1rem',
        lineHeight: '1rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        display: 'inline-block',
        width: '50%',
    }
};
