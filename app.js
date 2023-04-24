console.log("Hello! I am functioning correctly!");

var SiteURL = "https://s23-deploy-carterschofield-production.up.railway.app"
// var SiteURL = "http://localhost:8080"

var assignmentNameInput = document.querySelector('#assignment-name-input');
var assignmentCourseInput = document.querySelector('#course-input');
var assignmentETCInput = document.querySelector('#ETC-input');
var assignmentDueDateInput = document.querySelector('#due-date-input');
var assignmentDueTimeInput = document.querySelector('#due-time-input');
var assignmentList = document.querySelector('#assignment-list');
var randomButton = document.querySelector('#random-button');
var randomAssignmentList = document.querySelector('#random-assignment-list');
var addButton = document.querySelector('#submit');
var addArea = document.querySelector('#addArea'); 

var loginButton = document.querySelector('#login-button');
var loginArea = document.querySelector('#login-area');
var registerButton = document.querySelector('#register-button');
var registerArea = document.querySelector('#register-area');
var cancelLoginButton = document.querySelector('#cancel-login-button');
var registerUserButton = document.querySelector('#register-user-button');
var userExists = document.querySelector('#user-already-exists');
var unsucessfulLogin = document.querySelector('#user-login-unsucessful');

var userEmailInput = document.getElementById('email-input');
var userPasswordInput = document.getElementById('password-input');
var userFirstNameInput = document.getElementById('first-name-input');
var userLastNameInput = document.getElementById('last-name-input');

var navBar = document.querySelector('#nav-bar');

var myAssignments = [];

userExists.style.display = "none";
randomButton.style.display = "none";

// Clear the assignment input fields
function clearAssignmentInput() {
    assignmentNameInput.value = '';
    assignmentCourseInput.value = '';
    assignmentETCInput.value = '';
    assignmentDueDateInput.value = '';
    assignmentDueTimeInput.value = '';
};

function clearRegisterInput() {
    userEmailInput.value = '';
    userPasswordInput.value = '';
    userFirstNameInput.value = '';
    userLastNameInput.value = '';
}

function addAreaShow() {
    addArea.style.display = "flex";
}
function addAreaNotShow(){
    addArea.style.display = "none";
}

function loginScreenAppear() {
    loginArea.style.display = "block";
    registerArea.style.display = "none";
    userNotLoggedIn();
    addAreaNotShow();
}
function cancelLogin() {
    loginArea.style.display = "none";
    addAreaNotShow();
}

function registerScreenAppear() {
    registerArea.style.display = "block";
    loginArea.style.display = "none";
    addAreaNotShow();
}

function cancelRegister() {
    registerArea.style.display = "none";
    userExists.style.display = "none";
    addAreaNotShow();
}

function clearNavBar() {
    navBar.style.display = "none";
}

function clearLoginArea() {
    loginArea.style.display = "none";
}

function clearLoginInput(){
    userEmailInput.value = '';
    userPasswordInput.value = '';
}


// Event listener for the add button
addButton.onclick = function(event) {
    console.log("Add button was clicked");
    createAssignmentOnServer(assignmentNameInput.value, assignmentCourseInput.value, assignmentETCInput.value, assignmentDueDateInput.value, assignmentDueTimeInput.value);
};
// Event listener for the random button
randomButton.onclick = function (event) {
    console.log("Random button was clicked");
    selectRandomAssignment();
}

// Load assignment from the server/database
function loadAssignmentsFromServer() {
    // Clear assignment list
    assignmentList.innerHTML = '';
    fetch(SiteURL+'/assignments', {
        credentials: 'include'
    }).then(function(response) {
        response.json().then(function(data){
        myAssignments = data;
        console.log("my list element:", assignmentList);
        myAssignments.forEach(function(assignment) {
            var newItem = document.createElement('li');

            var nameDiv = document.createElement('div');
            nameDiv.innerText = assignment.name;
            nameDiv.classList.add("assignment-name");
            newItem.appendChild(nameDiv);

            var courseDiv = document.createElement('div');
            courseDiv.innerText = assignment.course;
            courseDiv.classList.add("assignment-course");
            newItem.appendChild(courseDiv);

            var etcDiv = document.createElement('div');
            etcDiv.innerText = assignment.estimated_time_completion;
            etcDiv.classList.add("assignment-etc");
            newItem.appendChild(etcDiv);

            var dueDateDiv = document.createElement('div');
            dueDateDiv.innerText = assignment.due_date;
            dueDateDiv.classList.add("assignment-due-date");
            newItem.appendChild(dueDateDiv);

            var dueTimeDiv = document.createElement('div');
            dueTimeDiv.innerText = assignment.due_time;
            dueTimeDiv.classList.add("assignment-due-time");
            newItem.appendChild(dueTimeDiv);
            
            var deleteButton = document.createElement('button');
            deleteButton.innerHTML = "Delete";
            deleteButton.classList.add("delete-button");
            deleteButton.onclick = function() {
                console.log("Delete button was clicked for: ", assignment.name);
                // IF EXTRA TIME have DOM element pop up for the user to click a buttom to confirm delete
                if (confirm("Are you sure you want to delete " +assignment.name + " assignment?")){
                    deleteAssignmentFromServer(assignment.id);
                }
            };
            newItem.appendChild(deleteButton);


            var editButton = document.createElement('button');
            editButton.innerHTML = "Edit";
            editButton.classList.add("edit-button");
            newItem.appendChild(editButton);
            editButton.onclick = function() {
                console.log("Edit button was clicked for: ", assignment.name);

                // Create the popup form
                var editForm = document.createElement('div');
                editForm.classList.add("edit-form-area");

                //Label and input for assignment name
                var assignmentNameDiv = document.createElement('div');
                var assignmentNameLabel = document.createElement('label');
                assignmentNameLabel.setAttribute('for', 'edit-assignment-name-input');
                assignmentNameLabel.innerText = "Assignment Name:";

                // Input for assignment name
                var assignmentNameInput = document.createElement('input');
                assignmentNameInput.setAttribute('type', 'text');
                assignmentNameInput.setAttribute('id', 'edit-assignment-name-input');
                assignmentNameInput.setAttribute('value', assignment.name);

                // Append the label and input to the div
                assignmentNameDiv.appendChild(assignmentNameLabel);
                assignmentNameDiv.appendChild(assignmentNameInput);
                editForm.appendChild(assignmentNameDiv);


                var assignmentCourseDiv = document.createElement('div');
                var assignmentCourseLabel = document.createElement('label');
                assignmentCourseLabel.setAttribute('for', 'edit-course-input');
                assignmentCourseLabel.innerText = "Course:";
                var assignmentCourseInput = document.createElement('input');
                assignmentCourseInput.setAttribute('type', 'text');
                assignmentCourseInput.setAttribute('id', 'edit-course-input');
                assignmentCourseInput.setAttribute('value', assignment.course);
                assignmentCourseDiv.appendChild(assignmentCourseLabel);
                assignmentCourseDiv.appendChild(assignmentCourseInput);
                editForm.appendChild(assignmentCourseDiv);

                var assignmentETCDiv = document.createElement('div');
                var assignmentETCLabel = document.createElement('label');
                assignmentETCLabel.setAttribute('for', 'edit-ETC-input');
                assignmentETCLabel.innerText = "Estimated Time Completion:";
                var assignmentETCInput = document.createElement('input');
                assignmentETCInput.setAttribute('type', 'text');
                assignmentETCInput.setAttribute('id', 'edit-ETC-input');
                assignmentETCInput.setAttribute('value', assignment.estimated_time_completion);
                assignmentETCDiv.appendChild(assignmentETCLabel);
                assignmentETCDiv.appendChild(assignmentETCInput);
                editForm.appendChild(assignmentETCDiv);

                var assignmentDueDateDiv = document.createElement('div');
                var assignmentDueDateLabel = document.createElement('label');
                assignmentDueDateLabel.setAttribute('for', 'edit-due-date-input');
                assignmentDueDateLabel.innerText = "Due Date:";
                var assignmentDueDateInput = document.createElement('input');
                assignmentDueDateInput.setAttribute('type', 'text');
                assignmentDueDateInput.setAttribute('id', 'edit-due-date-input');
                assignmentDueDateInput.setAttribute('value', assignment.due_date);
                assignmentDueDateDiv.appendChild(assignmentDueDateLabel);
                assignmentDueDateDiv.appendChild(assignmentDueDateInput);
                editForm.appendChild(assignmentDueDateDiv);

                var assignmentDueTimeDiv = document.createElement('div');
                var assignmentDueTimeLabel = document.createElement('label');
                assignmentDueTimeLabel.setAttribute('for', 'edit-due-time-input');
                assignmentDueTimeLabel.innerText = "Due Time:";
                var assignmentDueTimeInput = document.createElement('input');
                assignmentDueTimeInput.setAttribute('type', 'text');
                assignmentDueTimeInput.setAttribute('id', 'edit-due-time-input');
                assignmentDueTimeInput.setAttribute('value', assignment.due_time);
                assignmentDueTimeDiv.appendChild(assignmentDueTimeLabel);
                assignmentDueTimeDiv.appendChild(assignmentDueTimeInput);
                editForm.appendChild(assignmentDueTimeDiv);

                
                var editFormSubmitButton = document.createElement('button');
                editFormSubmitButton.innerHTML = "Submit";
                editFormSubmitButton.classList.add("edit-form-submit-button");
                editFormSubmitButton.onclick = function() {
                    console.log("Edit form submit button was clicked for: ", assignment.name);
                    var newAssignmentName = document.getElementById('edit-assignment-name-input').value;
                    var newAssignmentCourse = document.getElementById('edit-course-input').value;
                    var newAssignmentETC = document.getElementById('edit-ETC-input').value;
                    var newAssignmentDueDate = document.getElementById('edit-due-date-input').value;
                    var newAssignmentDueTime = document.getElementById('edit-due-time-input').value;
                    updateAssignmentOnServer(assignment.id, newAssignmentName, newAssignmentCourse, newAssignmentETC, newAssignmentDueDate, newAssignmentDueTime);
                };
                editForm.appendChild(editFormSubmitButton);

                var editFormCancelButton = document.createElement('button');
                editFormCancelButton.innerHTML = "Cancel";
                editFormCancelButton.classList.add("edit-form-cancel-button");
                editFormCancelButton.onclick = function() {
                    console.log("Edit form cancel button was clicked for: ", assignment.name);
                    editForm.remove();
                };
                editForm.appendChild(editFormCancelButton);
                
                // Add the form to the page
                newItem.appendChild(editForm);
            };
            addAreaShow();
            clearNavBar()
            loginArea.style.display = "none";
            myAssignments = data;
            assignmentList.appendChild(newItem);
            });
        });
    });
}

// Create assignment on the server/database
function createAssignmentOnServer(assignmentName, assignmentCourse, assignmentETC, assignmentDueDate, assignmentDueTime){
    console.log("Attempting to create a new assignment", assignmentName, "on the server");
    var data = "name=" + encodeURIComponent(assignmentName);
    data += "&course=" + encodeURIComponent(assignmentCourse);
    data += "&estimated_time_completion=" + encodeURIComponent(assignmentETC);
    data += "&due_date=" + encodeURIComponent(assignmentDueDate);
    data += "&due_time=" + encodeURIComponent(assignmentDueTime);
    console.log("sending data to server: ", data);
    fetch(SiteURL+'/assignments', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    }).then(function(response) {
        if (response.status == 201){
            console.log("Assignment created successfully");
            loadAssignmentsFromServer();
            clearAssignmentInput();
        } else{
            console.log("Error creating assignment: ", assignmentName, " responded with status code: ", response.status);
        }
    });
}
// Delete assignment from the server/database
function deleteAssignmentFromServer(assignmentId) {
    console.log("Attempting to delete assignment with id: ", assignmentId);
    fetch(SiteURL+'/assignments/' + assignmentId, {
        method: 'DELETE',
        credentials: 'include'
    }).then(function(response) {
        if (response.status == 200){
            loadAssignmentsFromServer();
        } else{
            console.log("Error deleting assignment with id: ", assignmentId, " responded with status code: ", response.status);
        }
    });
}

// Have it so that it autofilling inside the popup window with the assignment name and everything else. Make it easy to edit
// Update assignment on the server/database
function updateAssignmentOnServer(assignmentId, assignmentName, assignmentCourse, assignmentETC, assignmentDueDate, assignmentDueTime) {
    console.log("Attempting to update assignment with id: ", assignmentId);
    var data = "name=" + encodeURIComponent(assignmentName);
    data += "&course=" + encodeURIComponent(assignmentCourse);
    data += "&estimated_time_completion=" + encodeURIComponent(assignmentETC);
    data += "&due_date=" + encodeURIComponent(assignmentDueDate);
    data += "&due_time=" + encodeURIComponent(assignmentDueTime);
    console.log("sending data to server: ", data);
    fetch(SiteURL+'/assignments/' + assignmentId, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    }).then(function(response) {
        if (response.status == 200){
            console.log("Assignment updated successfully");
            loadAssignmentsFromServer();
            clearAssignmentInput();
        } else{
            console.log("Error updating assignment with id: ", assignmentId, " responded with status code: ", response.status);
        }
    });
}

loadAssignmentsFromServer();

function selectRandomAssignment() {
    if (myAssignments.length > 0) {
        var randomIndex = Math.floor(Math.random() * myAssignments.length);
        var randomAssignment = myAssignments[randomIndex];
        var assignmentItem = document.createElement('li');
        assignmentItem.innerHTML = `
            <div class="assignment-name">${randomAssignment.name}</div>
            <div class="assignment-course">${randomAssignment.course}</div>
            <div class="assignment-etc">${randomAssignment.estimated_time_completion}</div>
            <div class="assignment-due-date">${randomAssignment.due_date}</div>
            <div class="assignment-due-time">${randomAssignment.due_time}</div>
        `;
        randomAssignmentList.innerHTML = '';
        randomAssignmentList.appendChild(assignmentItem);
    }
}

// Event listener for the random button
registerUserButton.onclick = function (event) {
    console.log("Register a new user with all info button was clicked");
    registerNewUser(userEmailInput.value, userPasswordInput.value, userFirstNameInput.value, userLastNameInput.value);
}

function registerNewUser(userEmail, userPassword, userFirstName, userLastName){
    console.log("Attempting to register a new user", userFirstName, userLastName, "on the server");
    var data = "email=" + encodeURIComponent(userEmail);
    data += "&password=" + encodeURIComponent(userPassword);
    data += "&firstname=" + encodeURIComponent(userFirstName);
    data += "&lastname=" + encodeURIComponent(userLastName);
    console.log("sending data to server: ", data);
    fetch(SiteURL+'/users', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    }).then(function(response) {
        if (response.status == 201){
            console.log("User registered successfully");
            clearRegisterInput();
            userDoesntExist();
        } 
        else{
            if (response.status == 422){
                console.log("Error registering user: ", userFirstName, userLastName, " responded with status code: ", response.status);
                console.log("User already exists");
                userAlreadyExists();
                clearRegisterInput();
            } else{
            console.log("Error registering user: ", userFirstName, userLastName, " responded with status code: ", response.status);
            }
        }
    });
}

function userAlreadyExists(){
    userExists.style.display = "block";
}
function userDoesntExist(){
    userExists.style.display = "none";
}

var loginUserButton = document.getElementById('login-user-button');
var loginUserEmail = document.getElementById('email-input-login');
var loginUserPassword = document.getElementById('password-input-login');

loginUserButton.onclick = function (event) {
    console.log("Login user button was clicked");
    loginUser(loginUserEmail.value, loginUserPassword.value);
}

function loginUser(userEmail, userPassword){
    console.log("Attempting to login a user", userEmail, "on the server");
    userNotLoggedIn();
    var data = "email=" + encodeURIComponent(userEmail);
    data += "&password=" + encodeURIComponent(userPassword);
    console.log("sending data to server: ", data);
    fetch(SiteURL+'/sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data
    }).then(function(response) {
        if (response.status == 201){
            console.log("User logged in successfully");
            loadAssignmentsFromServer();
            clearLoginInput();
            usersucessLogin();
            clearNavBar();
            clearLoginArea();
        } else{
            userFailedLogin();
            console.log("Error logging in user: ", userEmail, " responded with status code: ", response.status);
        }
    });
}

function userFailedLogin(){
    unsucessfulLogin.style.display = "block";
}
function usersucessLogin(){
    unsucessfulLogin.style.display = "none";
}
function userNotLoggedIn(){
    unsucessfulLogin.style.display = "none";
}