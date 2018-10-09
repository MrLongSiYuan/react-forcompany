// 慢病病历--医生端&患者端 病历主页

var React = require('react');
var ApiFactory = require('./../../cmp/ApiFactory.js');
var Fetch = require('./../../fetch/fetch.js');
var AntdMobile = require('./../../antdMobile/antdMobile.js');
var Toast = AntdMobile.Toast;

var DoctorIndex = require('./doctorEnd/DoctorIndex.js');
var PatientIndex = require('./patientEnd/PatientIndex.js');
var DiseaseCondition = require('./common/diseaseConditionDetail/DiseaseCondition.js');
var DiseaseDiagnosis = require('./common/diseaseDiagnosis/DiseaseDiagnosis.js');
var BasicDiseases = require('./common/diseaseDiagnosis/BasicDiseases.js');
var ConcomitantDiseases = require('./common/diseaseDiagnosis/ConcomitantDiseases.js');
var UseMedicineRecord = require('./common/diseaseCourse/MedicineRecord.js');
var MedicalAdvice = require('./common/diseaseCourse/MedicalAdvice.js');
var MedicalReport = require('./common/diseaseCourse/MedicalReport.js');
var ImageMaterial = require('./common/diseaseCourse/ImageMaterial.js');
var PathologyMaterial = require('./common/diseaseCourse/PathologyMaterial.js');
var ConsultationReport = require('./common/diseaseCourse/ConsultationReport.js');
require('./common/css/edc_casehistory.css');


var style = {
    box:{
        overflowY: 'scroll',
        webkitOverflowScrolling: 'touch',
    }
}

module.exports = React.createClass({

    getInitialState: function () {
        return {
            type: this.props.params.role,
            patientInfo: {
                ageStr: '',
                area: '',
                birthday: '',
                headPicFileName: '',
                name: '',
                patientId: '',
                phone: '',
                sex: '',
                tags: [],
                remark: '',
                remarkName: '',
                userId: ''
            },
            illHistoryRecords: {
                careInstructVos: [],
                checkReportVos: [],
                diagnosisVos: [],
                drugRecordVos: [],
                illContentInfo: {},
            },
            isShowButton: localStorage.getItem('orderId') ? true : false
        };
    },

    componentDidMount: function () {
        document.title = '病历';
        var patientInfo = localStorage.getItem('patientInfo');
        // 判断患者信息是否为空
        if (!patientInfo) {
            this.fetchPatientInfo();
        } else {
            this.setState({
                patientInfo: JSON.parse(patientInfo)
            });
        }

        var illHistoryRecords = localStorage.getItem('illHistoryRecords');
        // 判断病程信息是否为空
        if (!illHistoryRecords) {
            this.fetchIllHistoryRecords();
        } else {
            this.setState({
                illHistoryRecords: JSON.parse(illHistoryRecords)
            });
        }

        if (!patientInfo || !illHistoryRecords) {
            Toast.loading('加载中...', 0);
        }

        window.removePatientInfoFromStorage = this.removePatientInfoFromStorage.bind(this);
        window.removeIllHistoryRecordsFromStorage = this.removeIllHistoryRecordsFromStorage.bind(this);
        window.fetchIllHistoryRecords = this.fetchIllHistoryRecords.bind(this);
    },

    // 获取患者信息
    fetchPatientInfo: function () {
        var config = {
            url: ApiFactory.caseHistory.patientInfo,
            data: {
                access_token: localStorage.getItem('access_token'),
                illHistoryInfoId: localStorage.getItem('illHistoryInfoId')
            }
        };
        Fetch(config)
            .then(function (patientInfo) {
                if (patientInfo) {
                    this.setState({
                        patientInfo: patientInfo
                    });
                    localStorage.setItem('patientInfo', JSON.stringify(patientInfo));
                    localStorage.setItem('doctorId', patientInfo.doctorId);
                    localStorage.setItem('patientId', patientInfo.patientId);
                }

                Toast && Toast.hide();
            }.bind(this));
    },

    //  清除患者信息localStorage
    removePatientInfoFromStorage: function () {
        localStorage.removeItem('patientInfo');
    },

    //  清除病程信息localStorage
    removeIllHistoryRecordsFromStorage: function () {
        localStorage.removeItem('illHistoryRecords');
    },

    // 获取病程信息
    fetchIllHistoryRecords: function () {
        var config = {
            url: ApiFactory.caseHistory.getIllHistroyRecords_new + localStorage.getItem('illHistoryInfoId'),
            type: 'GET'
        };
        Fetch(config)
            .then(function (illHistoryRecords) {
                if (illHistoryRecords) {
                    this.setState({
                        illHistoryRecords: illHistoryRecords,
                        isShowButton: illHistoryRecords.planStatus
                    });
                    localStorage.setItem('illHistoryRecords', JSON.stringify(illHistoryRecords));
                    localStorage.setItem('planDiseaseTypeId', illHistoryRecords.planDiseaseTypeId || '');
                }

                Toast && Toast.hide();
            }.bind(this));
    },

    render: function() {
        var type = this.state.type;
        var isShowButton = this.state.isShowButton;
        var patientInfo = this.state.patientInfo;
        var illHistoryRecords = this.state.illHistoryRecords;
        return (
            <div className="edc-casehistory scroll-box">

                {type == 'doctor' && <DoctorIndex type={type} patientInfo={patientInfo} />}
                {type == 'patient' && <PatientIndex type={type} patientInfo={patientInfo} />}
                <DiseaseCondition type={type} condition={illHistoryRecords.illContentInfo || {}} />
                <DiseaseDiagnosis type={type} diagnosis={illHistoryRecords.firstDiagnosis || {}} />
                <BasicDiseases type={type} basicDiseases={illHistoryRecords.basicDiagnosis || {}} />
                <ConcomitantDiseases type={type} concomitantDiseases={illHistoryRecords.accompanyDiagnosis || {}} />
                <ImageMaterial type={type} material={illHistoryRecords.imagingAndWeiyunBaseVos || []} />
                <PathologyMaterial type={type} material={illHistoryRecords.pathologyVos || []} />
                <ConsultationReport type={type} report={illHistoryRecords.mdtOrderVos || []} />
                <UseMedicineRecord type={type} record={illHistoryRecords.recordDrugVos || []} />
                <MedicalAdvice isShowButton={isShowButton} type={type} advice={illHistoryRecords.careInstructVos || []} />
                <MedicalReport type={type} report={illHistoryRecords.checkReportVos || []} />
            </div>
        );
    }
});
