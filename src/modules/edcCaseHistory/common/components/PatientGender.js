// 慢病病历--医生端&患者端 患者性别

var React = require('react');


module.exports = React.createClass({

    render: function() {
        var ageStr = this.props.ageStr;
        var sex = this.props.sex == 1 ? 'boy.png' : 'girl.png';     // 1男，2女
        var sexColor = this.props.sex == 1 ? '#3889f5' : '#ff7877';
        return (
            <span>
                {
                    ageStr &&
                        <span style={{
                            backgroundImage: 'url(' + require("./../images/" + sex) + ')',
                            backgroundSize: 'contain',
                            backgroundColor: sexColor,
                            backgroundRepeat: 'no-repeat',
                            display: 'inline-block',
                            height: '16px',
                            fontSize: '12px',
                            lineHeight: '18px',
                            paddingLeft: '20px',
                            paddingRight: '3px',
                            color: '#fff',
                            borderRadius: '3px',
                            marginRight: '8px',
                        }}>
                            <span style={{lineHeight: '16px', verticalAlign: 'top'}}>{ageStr}</span>
                        </span>
                }
            </span>
        );
    }
});
