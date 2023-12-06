var BaseURL = 'http://api.login2explore.com:5577'; disableAllExceptRollno
var IRL = '/api/irl';
var IML = '/api/iml';
var Database = 'SCHOOL-DB';
var Relation = 'STUDENT-TABLE';
var connToken = '90931604|-31949332174105727|90961742';

setBaseURL(BaseURL);

$('#rollNo').focus();
function saveRecNo(jsonObject) {
    var lvData = JSON.parse(jsonObject.data);
    localStorage.setItem('recordNo', lvData.rec_no);
}

function saveRecNo2LS(jsonObj){
    var lvData=JSON.parse(jsonObj.data);
    localStorage.setItem("rec_no", lvData.rec_no);
}

function disableAllExceptRollno() {
    $('#fullName').prop('disabled', true);
    $('#class').prop('disabled', true);
    $('#birthDate').prop('disabled', true);
    $('#inputAddress').prop('disabled', true);
    $('#enrollmentDate').prop('disabled', true);
    $('#resetBtn').prop('disabled', true);
    $('#saveBtn').prop('disabled', true);
    $('#updateBtn').prop('disabled', true);
    enableRollNoField();
}

function disableRollNoField() {
    $('#rollNo').prop('disabled', true);
}

function enableRollNoField() {
    $('#rollNo').prop('disabled', false);
}

function initForm() {
    localStorage.removeItem('first_rec_no');
    localStorage.removeItem('last_rec_no');
    localStorage.removeItem('rec_no');
    console.log("initForm() done");
}

function newForm(){
    makeDataFormEmpty();
    $('#rollNo').focus();
    $('#saveBtn').prop('disabled', false);
    $('#resetBtn').prop('disabled', false);
}

function makeDataFormEmpty(){
    $('#rollNo').val("");
    $('#fullName').val("");
    $('#class').val("");
    $('#birthDate').val("");
    $('#inputAddress').val("");
    $('#enrollmentDate').val("");
}

function resetForm() {
    $('#rollNo').val("");
    $('#fullName').val("");
    $('#class').val("");
    $('#birthDate').val("");
    $('#inputAddress').val("");
    $('#enrollmentDate').val("");

    $('#rollNo').prop('disabled', false);
    disableAllExceptRollno();
    $('#rollNo').focus();
    enableRollNoField();

}

function fillData(jsonObject) {
    saveRecNo(jsonObject);
    var data=JSON.parse(jsonObject.data).record;
    if (jsonObject === "") {
        $('#fullName').val("");
        $('#class').val("");
        $('#birthDate').val("");
        $('#inputAddress').val("");
        $('#enrollmentDate').val("");
    } else {
        saveRecNo(jsonObject);

        var data = JSON.parse(jsonObject.data).record;

        $('#fullName').val(data.name);
        $('#class').val(data.className);
        $('#birthDate').val(data.birthDate);
        $('#inputAddress').val(data.address);
        $('#enrollmentDate').val(data.enrollmentData);
    }
}

function validateEnrDate() {
    var inputBirthDate = $('#birthDate').val();
    var inputEnrollmentDate = $('#enrollmentDate').val();
    inputBirthDate = new Date(inputBirthDate);
    inputEnrollmentDate = new Date(inputEnrollmentDate);
    return inputBirthDate.getTime() < inputEnrollmentDate.getTime();

}

function setFirstRecNo2LS(jsonObj){
    var data=JSON.parse(jsonObj.data);
    if(data.rec_no===undefined){
        localStorage.setItem("first_rec_no","0");
    } else{
        localStorage.setItem("first_rec_no", data.rec_no);
    }
}

function getFirstRecNoFromLS(){
    return localStorage.getItem("first_rec_no");
}

function setLastRecNo2LS(jsonObj){
    var data=JSON.parse(jsonObj.data);
    if(data.rec_no===undefined){
        localStorage.setItem("last_rec_no","0");
    } else{
        localStorage.setItem("last_rec_no", data.rec_no);
    }
}

function getLastRecNoFromLS(){
    return localStorage.getItem("last_rec_no");
}

function isNoRecordPresentLS(){
    if(getFirstRecNoFromLS()==="0" && getLastRecNoFromLS()==="0"){
        return true;
    }
    return false;
}

function isOnlyOneRecordPresent(){
    if(isNoRecordPresentLS()){
        return false;
    }
    if(getFirstRecNoFromLS()===getLastRecNoFromLS){
        return true;
    }
    return false;
}

function setCurrRecNo2LS(jsonObj){
    var data=JSON.parse(jsonObj.data);
    localStorage.setItem("rec_no", data.rec_no);
    
}

function getCurrRecNoFromLS(){
    return localStorage.getItem("rec_no");
}

function validateFormData() {
    var rollNo, name, className, birthDate, address, enrollmentData;
    rollNo = $('#rollNo').val();
    name = $('#fullName').val();
    className = $('#class').val();
    birthDate = $('#birthDate').val();
    address = $('#inputAddress').val();
    enrollmentData = $('#enrollmentDate').val();

    if (rollNo === '') {
        alert(0, 'Roll-No Missing');
        $('#rollNo').focus();
        return "";
    }

    if (rollNo <= 0) {
        alert(0, 'Invalid Roll-No');
        $('#rollNo').focus();
        return "";
    }

    if (className === '') {
        alert(0, 'Class Name is Missing');
        $('#class').focus();
        return "";
    }
    if (className <= 0 && className > 12) {
        alert(0, 'Invalid Class Name');
        $('#class').focus();
        return "";
    }
    if (birthDate === '') {
        alert(0, 'Birth Date Is Missing');
        $('#birthDate').focus();
        return "";
    }
    if (address === '') {
        alert(0, 'Address Is Missing');
        $('#address').focus();
        return "";
    }
    if (enrollmentData === '') {
        alert(0, 'Enrollment Data Is Missing');
        $('#enrollmentDate').focus();
        return "";
    }

    if (!validateEnrDate()) {
        alert(0, 'Invalid Enrollment Date(i.e Enrollment Date should be greater than Birth Date)');
        $('#enrollmentData').focus();
        return "";
    }

    var jsonStrObj = {
        id: rollNo,
        name: name,
        className: className,
        birthDate: birthDate,
        address: address,
        enrollmentData: enrollmentData
    };

    return JSON.stringify(jsonStrObj);
}

function getRnoAsJsonObj() {
    var rollNO = $('#rollNo').val();
    var jsonStr = {
        id: rollNO
    };
    return JSON.stringify(jsonStr);
}

function getStudentData() {

    if ($('#rollNo').val() === "") {
        disableAllExceptRollno();
        enableRollNoField();
    } else if ($('#rollNo').val() < 1) {
        disableAllExceptRollno();
        enableRollNoField();
        $('#rollNo').focus();
    } else {
        var studentRollnoJsonObj = getRnoAsJsonObj();


        var getRequest = createGET_BY_KEYRequest(connToken, Database, Relation, studentRollnoJsonObj);

        jQuery.ajaxSetup({ async: false });

        var resJsonObj = executeCommand(getRequest, BaseURL, IRL);
        
        disableRollNoField();

        $('#rollNo').prop('disabled', false);
        $('#fullName').prop('disabled', false);
        $('#class').prop('disabled', false);
        $('#birthDate').prop('disabled', false);
        $('#inputAddress').prop('disabled', false);
        $('#enrollmentDate').prop('disabled', false);


        if (resJsonObj.status === 400) {
            $('#resetBtn').prop('disabled', false);
            $('#saveBtn').prop('disabled', false);
            $('#updateBtn').prop('disabled', true);
            fillData("");
            $('#name').focus();
        } else if (resJsonObj.status === 200) {
            $('#rollNO').prop('disabled', true);
            fillData(resJsonObj);
            $('#resetBtn').prop('disabled', false);
            $('#updateBtn').prop('disabled', false);
            $('#saveBtn').prop('disabled', true);
            disableRollNoField();
            $('#name').focus();
        }
    }
    jQuery.ajaxSetup({ async: true });
    $('#fullName').focus();

}

function showData(jsonObj) {
    if (jsonObj.status === 400) {
        return;
    }
    var data = (JSON.parse(jsonObj)).record;
    setCurrRecNo2LS(jsonObj);

    $('#fullName').val(data.name);
    $('#class').val(data.className);
    $('#birthDate').val(data.birthDate);
    $('#inputAddress').val(data.address);
    $('#enrollmentDate').val(data.enrollmentData);

    $('#resetBtn').prop('disabled', true);
    $('#saveBtn').prop('disabled', true);
    $('#updateBtn').prop('disabled', true);

    if (getCurrRecNoFromLS() === getLastRecNoFromLS()) {
        $('#next').prop('disabled', true);
        $('#last').prop('disabled', true);
    }
    if (getCurrRecNoFromLS() === getFirstRecNoFromLS()) {
        $('#first').prop('disabled', true);
        $('#prev').prop('disabled', true);
    }
}

function getFirst() {
    var getFirstRequest = createFIRST_RECORDRequest(connToken, Database, Relation);
    jQuery.ajaxSetup({ async: false });
    var result = executeCommand(getFirstRequest, irlPartUrl);
    showData(result);
    setFirstRecNo2LS(result);
    jQuery.ajaxSetup({ async: true })
    $('#rollNo').prop('disabled', true);
    $('#fullName').prop('disabled', true);
    $('#class').prop('disabled', true);
    $('#birthDate').prop('disabled', true);
    $('#inputAddress').prop('disabled', true);
    $('#enrollmentDate').prop('disabled', true);
}

function getLast() {
    var getLastRequest = createLAST_RECORDRequest(connToken, Database, Relation);
    jQuery.ajaxSetup({ async: false });
    var result = executeCommand(getLastRequest, irlPartUrl);
    showData(result);
    setLastRecNo2LS(result);
    jQuery.ajaxSetup({ async: true })
    $('#rollNo').prop('disabled', true);
    $('#fullName').prop('disabled', true);
    $('#class').prop('disabled', true);
    $('#birthDate').prop('disabled', true);
    $('#inputAddress').prop('disabled', true);
    $('#enrollmentDate').prop('disabled', true);
}

function getPrev(){
    var r=getCurrRecNoFromLS();
    if (r===1){
        $('#prev').prop('disabled', true);
        $('#first').prop('disabled', true);
    }
    var getPrevRequest=createPREV_RECORDRequest(connToken, Database, Relation, r);
    jQuery.ajaxSetup({async: false});
    var result=executeCommand(getPrevRequest, irlPartUrl)
    showData(result);
    jQuery.ajaxSetup({async: true});
    var r=getCurrRecNoFromLS();
    $('#saveBtn').prop('disabled', true);
}

function getNext(){
    var r=getCurrRecNoFromLS();
    
    var getNextRequest=createNEXT_RECORDRequest(connToken, Database, Relation, r);
    jQuery.ajaxSetup({async: false});
    var result=executeCommand(getNextRequest, irlPartUrl);
    showData(result);
    jQuery.ajaxSetup({async: true});
    var r=getCurrRecNoFromLS();
    $('#saveBtn').prop('disabled', true);
}

function saveData() {
    var jsonStrObj = validateFormData();

    if (jsonStrObj === '')
        return '';

    var putRequest = createPUTRequest(connToken, jsonStrObj, Database, Relation);
    jQuery.ajaxSetup({ async: false });

    var resJsonObj = executeCommand(putRequest, BaseURL, IML);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
    } else if (resJsonObj.status === 200) {
    }

    if(isNoRecordPresentLS()){
        setFirstRecNo2LS(jsonObj);
    }

    setLastRecNo2LS(jsonObj);
    setCurrRecNo2LS(jsonObj);

    resetForm();

    $('#rollNo').focus();
}

function updateData() {
    $('#changeBtn').prop('disabled', true);
    var jsonChg = validateFormData();

    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, Database, Relation, localStorage.getItem("rec_no"));
    jQuery.ajaxSetup({ async: false });

    var resJsonObj = executeCommand(updateRequest, BaseURL, IML);
    jQuery.ajaxSetup({ async: true });

    if (resJsonObj.status === 400) {
    } else if (resJsonObj.status === 200) {
    }

    resetForm();
    $('#rollNo').focus();
}

initForm();
getFirst();
getLast();
