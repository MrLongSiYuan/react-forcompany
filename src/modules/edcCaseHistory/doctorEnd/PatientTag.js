// 慢病病历--医生端&患者端 患者标签

var React = require('react');


module.exports = React.createClass({

    render: function() {
        var fontSize = this.props.fontSize;
        return (
            <div style={{whiteSpace: 'normal', textAlign: 'start',}}>
                {
                    this.props.tags && this.props.tags.length > 0 && this.props.tags.map(function (value) {
                            return <span style={{
                                color: '#fff',
                                background: '#9bb1db',
                                borderRadius: '100px',
                                padding: fontSize ? '2px 8px' : '3px 8px',
                                margin: fontSize ? '2px 5px 2px 0' : '3px 5px 3px 0',
                                display: 'inline-block',
                                fontSize: fontSize || '16px'
                            }}>{value}</span>
                        })
                }
            </div>
        );
    }
});
