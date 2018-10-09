// 预约--医生端&患者端 展示空数据组件

var React = require('react');


module.exports = React.createClass({

    render: function() {
        return (
            <div style={{textAlign: 'center', marginTop: '100px'}}>
                <img src={require('./../images/recode@2x.png')} style={{maxWidth:'230px', maxHight:'120px'}} />
                <p style={{color: '#ccc', fontSize: '15px'}}>暂无数据</p>
            </div>
        );
    }
});
