// 预约--患者端 注意事项信息

var React = require('react');


module.exports = React.createClass({

    render: function() {
        return (
            <div style={{background: '#f5f7f7', color: '#999', padding: '15px 15px 0 15px', marginTop: '10px', fontSize: '15px'}}>
                <p>
                    1、提交预约后，请保持电话畅通，工作人员会在近期联系确定本次预约。
                </p>
                <p>
                    2、预约成功后，请在规定的时间，到达预约地点。
                </p>
                <p>
                    3、如有特殊情况请提前与工作人员联系。
                </p>
            </div>
        );
    }
});
