// 预约--医生端&患者端 预约列表

var React = require('react');

var PatientList = require('./patientEnd/PatientList.js');
var DoctorList = require('./doctorEnd/DoctorList.js');
require('./common/css/make_appointment.css');


module.exports = React.createClass({

    render: function() {
        var type = this.props.params && this.props.params.type;
        var list = type == 'doctor' ? <DoctorList type={type} /> : <PatientList type={type} />;
        return list;
    }
});
