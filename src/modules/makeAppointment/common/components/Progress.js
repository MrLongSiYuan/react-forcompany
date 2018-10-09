// 预约--医生端&患者端 进度显示

var React = require('react');
var AntdMobile = require('./../../../../antdMobile/antdMobile.js');
var Flex = AntdMobile.Flex;


module.exports = React.createClass({

    renderBall: function (item, index) {
        var isFirst = index == 0;
        var isReach = item.isReach;
        var backgroundColor = isReach ? '#22bb91' : '#cdcece';
        var fontColor = isReach ? '#686868' : '#aaa';
        var imgSource = require('./../images/' + item.source);
        var showImg = (
                <Flex justify="end" align="center">
                    {
                        !isFirst &&
                        <Flex.Item
                            style={{
                                borderTop: '1px solid' + backgroundColor,
                            }}
                        />
                    }
                    <span
                        style={{
                            color: '#000',
                            borderRadius: '100%',
                            width: '50px',
                            height: '50px',
                            display: 'inline-block',
                            fontSize: '13px',
                            textAlign: 'center',
                            lineHeight: '15px',
                        }}
                    >
                        <img
                            style={{
                                width: '50px',
                                height: '50px',
                            }}
                            src={imgSource} />
                    </span>
                </Flex>
        );
        var content = (
            <div style={{textAlign: isFirst ? 'center' : 'end', fontSize: '13px', color: fontColor, marginTop: '10px'}}>
                {item.title}
            </div>
        );

        return (
            isFirst ?
                <div>
                    {showImg}
                    {content}
                </div> :
                <Flex.Item style={{position: 'relative'}}>
                    {showImg}
                    {content}
                </Flex.Item>
        );
    },

    render: function() {
        var list = this.props.list;
        return (
            <Flex justify="center" align="center" className="progress-info" style={{marginBottom: '10px', background: '#fff', padding: '23px 20px'}}>
                {
                    list && list.length > 0 &&
                    list.map(function (item, index) {
                        return this.renderBall(item, index);
                    }.bind(this))
                }
            </Flex>
        );
    }
});
