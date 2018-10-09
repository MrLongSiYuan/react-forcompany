'use strict';

require('./main.css');
// require('react-fastclick');

var React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var history = ReactRouter.hashHistory;
var Cordova = require('./cordova/cordova_main.js');

// 模块
// var Login = require('./modules/login/Login.js');

// 预约--预约主页
var AppointmentList= require('./modules/makeAppointment/AppointmentList.js');
var AppointmentDetail= require('./modules/makeAppointment/AppointmentDetail.js');

// edc病历--医生端&患者端 患者病历
var EdcCaseHistoryIndex= require('./modules/edcCaseHistory/Index.js');
var EdcDoctorEdit= require('./modules/edcCaseHistory/doctorEnd/DoctorEdit.js');
var EdcAddTag= require('./modules/edcCaseHistory/doctorEnd/AddTag.js');
var EdcPatientEdit= require('./modules/edcCaseHistory/patientEnd/PatientEdit.js');
// var EdcAddDiagnoses = require('./modules/edcCaseHistory/common/diseaseDiagnosis/AddDiagnosis.js');
// var EdcSelectDisease = require('./modules/edcCaseHistory/common/diseaseDiagnosis/SelectDiseaie.js');
// var EdcEditConditionDetail = require('./modules/edcCaseHistory/common/diseaseConditionDetail/EditConditionDetail.js');
var AddMedicalReport = require('./modules/edcCaseHistory/common/diseaseCourse/AddMedicalReport.js');
// var CheckItem = require('./modules/edcCaseHistory/common/diseaseCourse/CheckItem.js');

// MDT
var ConsultationLog= require('./modules/MDT/patientEnd/ConsultationLog.js');

// 邀请医生
var InviteDoctor= require('./modules/inviteDoctor/Registration.js');

// 主页
var AppContent = React.createClass({

    componentWillMount: function () {
        localStorage.clear();
        this.getInfoFromApp();
    },

    componentDidMount: function() {
        var location = this.props.location,
            pathname = location.pathname;

        if (pathname.indexOf('invite_doctor') > -1) {
            
        } else {
            // 初始化cordova
            Cordova.init(function() {
    
            });
        }
    },

    getInfoFromApp: function () {
        var href = window.location.href;
        var query = href.split('?')[1];
        var params = query.split('&');
        params && params.map(function (item) {
            var key = item.split('=')[0];
            var value = item.split('=')[1];
            localStorage.setItem(key, value);
        });
    },

    render: function() {
        return (
            <div className="abc" style={{height:'100%',width:'100%','overflow-x': 'hidden','overflow-y': 'scroll'}}>
                {this.props.children}
            </div>
        );
    }
});

// 内容
var mainCom = ReactDOM.render(
    <Router history={history} >
        <Route path="/" component={AppContent}>
            {/* <Route path="login" component={Login}/> */}

            {/*// 预约--预约主页*/}
            <Route path="appointment_list/:type" component={AppointmentList} />
            <Route path="make_appointment/:type" component={AppointmentDetail} />

            {/*// edc病历--医生端&患者端 患者病历*/}
            <Route path="edc_casehistory/:role" component={EdcCaseHistoryIndex} />
            <Route path="edc_doctor_edit" component={EdcDoctorEdit}>
                <Route path="edc_doctor_add_tag" component={EdcAddTag} />
            </Route>
            <Route path="edc_patient_edit" component={EdcPatientEdit} />
            {/* <Route path="edc_add_diagnoses" component={EdcAddDiagnoses} >
                <Route path="select_disease" component={EdcSelectDisease} />
            </Route> */}
            {/* <Route path="edc_edit_condition_detail" component={EdcEditConditionDetail} /> */}

            <Route path="edc_add_medical_report" component={AddMedicalReport} />
                {/* <Route path="edc_check_item" component={CheckItem} /> */}
            {/* </Route> */}

            {/*// MDT--会诊日志*/}
            <Route path="consultation_log" component={ConsultationLog} />

            {/*// MDT--邀请医生*/}
            <Route path="invite_doctor/:doctorId" component={InviteDoctor} />

        </Route>
    </Router>,
    document.getElementById('app')
);
