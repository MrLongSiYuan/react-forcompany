// 预约--医生端&患者端 预约详情主页

var React = require('react');

var PatientDetail = require('./patientEnd/PatientDetail.js');
var DoctorDetail = require('./doctorEnd/DoctorDetail.js');
require('./common/css/make_appointment.css');


module.exports = React.createClass({

    render: function() {
        var type = this.props.params && this.props.params.type;
        var item = this.props.location.state && this.props.location.state.item;
        var list = type == 'doctor' ? <DoctorDetail item={item} type={type} /> : <PatientDetail item={item} type={type} />;
        return (
            <div className="scroll-box">
                {list}
            </div>
        );
    }
});
