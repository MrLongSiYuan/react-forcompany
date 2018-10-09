// 预约--患者端 剩余预约次数

var React = require('react');


module.exports = React.createClass({

    render: function() {
        var count = this.props.appointmentCount;
        
        return (
            <div style={{
                textAlign: 'center',
                padding: '10px'}}>
                {
                    count > 0 ? '当前剩余预约次数：' + count + '次' : '当前暂无预约次数'
                }
            </div>
        );
    }
});
