var BaseURL = 'http://api.login2explore.com:5577';disableAllExceptRollno
var IRL = '/api/irl';
var IML = '/api/iml';
var Database = 'SCHOOL-DB';
var Relation = 'STUDENT-TABLE';
var connToken = '90931604|-31949332174105727|90961742';

$('#rollNo').focus();
function saveRecNo(jsonObject) {
    var lvData = JSON.parse(jsonObject.data);
    localStorage.setItem('recordNo', lvData.rec_no);
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


}

function fillData(jsonObject) {
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
    } else if ($('#rollNo').val() < 1) { 
        disableAllExceptRollno();
        $('#rollNo').focus();
    } else { 
        var studentRollnoJsonObj = getRnoAsJsonObj(); 
        
        
        var getRequest = createGET_BY_KEYRequest(connToken, Database, Relation, studentRollnoJsonObj);
        
        jQuery.ajaxSetup({async: false});
        
        var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, BaseURL, IRL);
        jQuery.ajaxSetup({async: true});
        
        
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
            $('#name').focus();
        }
    }



}

function saveData() {
    var jsonStrObj = validateFormData();
    
    if (jsonStrObj === '')
        return '';

    var putRequest = createPUTRequest(connToken, jsonStrObj, Database, Relation);
    jQuery.ajaxSetup({async: false});
    
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, BaseURL, IML);
    jQuery.ajaxSetup({async: true});
    
    if (resJsonObj.status === 400) {
    } else if (resJsonObj.status === 200) {
    }
    resetForm();
    
    $('#empid').focus();
}

function updateData() {
    $('#changeBtn').prop('disabled', true);
    var jsonChg = validateFormData(); 
    
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, Database, Relation, localStorage.getItem("recordNo"));
    jQuery.ajaxSetup({async: false});
    
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, BaseURL, IML);
    jQuery.ajaxSetup({async: true});
    
    if (resJsonObj.status === 400) {
    } else if (resJsonObj.status === 200) {
    }
    
    resetForm();
    $('#empid').focus();
}

