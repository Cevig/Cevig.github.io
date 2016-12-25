document.addEventListener("DOMContentLoaded", onload, false);
document.querySelector('.glyphicon-plus-sign').addEventListener("click", newNote, false);


function onload() {
    var formData = new FormData();
    formData.append('fetch', 'getAll');
    request('POST', '/ajax/ajax.php', formData)
        .then(function (e) {
            if (!isJsonString(e.target.response)) alert('Wrong connection to db: ' + e.target.response);
            var data = JSON.parse(e.target.response);
            getAllNotes(data);
        });
}

function newNote() {
    if (document.querySelector('.on-edit')) return;
    document.forms.person.name.value = '';
    document.forms.person.lname.value = '';
    document.forms.person.email.value = '';
    toogleForm('new');
}

function editNote(e) {
    if (!document.querySelector('.on-edit') && !document.forms.person.classList.contains('hidden')) return;
    var tr = e.target.closest('TR');
    if (document.querySelector('.on-edit') && document.querySelector('.on-edit').getAttribute('id') != tr.getAttribute('id')) {
        document.querySelector('.on-edit').classList.toggle('on-edit');
        toogleForm('user-' + tr.getAttribute('id'));
    }
    tr.classList.toggle('on-edit');
    var columns = tr.querySelectorAll('TD');

    document.forms.person.name.value = columns[0].textContent;
    document.forms.person.lname.value = columns[1].textContent;
    document.forms.person.email.value = columns[2].textContent;
    toogleForm('user-' + tr.getAttribute('id'));
}

function removeNote(e) {
    if (document.querySelector('.on-edit')) return;
    var tr = e.target.closest('TR');
    var id = tr.getAttribute('id');
    var formData = new FormData();
    formData.append('fetch', 'remove');
    formData.append('id', id);
    request('POST', '/ajax/ajax.php', formData)
        .then(function () {
            if (!isJsonString(e.target.response)) alert('Wrong connection to db: ' + e.target.response);
            tr.parentNode.removeChild(tr);
            checkTable();
        });
}

function addNote(form) {
    var formData = new FormData(form);
    formData.append('fetch', 'create');
    request('POST', '/ajax/ajax.php', formData)
        .then(function (e) {
            if (!isJsonString(e.target.response)) alert('Wrong connection to db: ' + e.target.response);
            var id = JSON.parse(e.target.response);
            appendNote(formData, id);
        });
}

function checkForm(form) {
    var valid = true;
    var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var regName = new RegExp("^[а-яА-ЯёЁa-zA-Z]+$");
    if (form.name.value == '' || !regName.test(form.name.value)) {
        form.name.classList.add('invalid-form');
        valid = false;
    }
    else {
        form.name.classList.remove('invalid-form');
    }
    if (form.lname.value == '' || !regName.test(form.lname.value)) {
        form.lname.classList.add('invalid-form');
        valid = false;
    }
    else {
        form.lname.classList.remove('invalid-form');
    }
    if (!regEmail.test(form.email.value)) {
        form.email.classList.add('invalid-form');
        valid = false;
    }
    else {
        form.email.classList.remove('invalid-form');
    }
    if (valid) sendRequest(form);
}

function sendRequest(form) {
    if (form.dataset.action == 'new')
        addNote(form);
    else {
        var atrr = form.dataset.action.split('-');
        var id = atrr[1];
        var formData = new FormData(form);
        var tr = document.querySelector('.on-edit');
        var columns = tr.querySelectorAll('TD');
        if (columns[0].textContent != formData.get('name') ||
            columns[1].textContent != formData.get('lname') ||
            columns[2].textContent != formData.get('email')) {
            formData.append('fetch', 'update');
            formData.append('id', id);
            request('POST', '/ajax/ajax.php', formData)
                .then(function () {
                    if (!isJsonString(e.target.response)) alert('Wrong connection to db: ' + e.target.response);
                    columns[0].textContent = formData.get('name');
                    columns[1].textContent = formData.get('lname');
                    columns[2].textContent = formData.get('email');
                });
        }
        tr.classList.toggle('on-edit');
        toogleForm('user-' + id);
    }
}
function request(method, url, data) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = resolve;
        xhr.onerror = reject;
        xhr.send(data);
    });
}

function getAllNotes(data) {
    var table = document.querySelector("table");
    var tbody = table.querySelector('tbody');

    var str = "";
    for (var user in data) {
        str += "<tr id = " + user + "><td>" + data[user].name + "</td><td>" + data[user].last_name + "</td><td>" + data[user].email + "</td>";
        str += "<td><a href='#' class='glyphicon glyphicon-pencil' onclick='editNote(event)'></a><a href='#' " +
            "class='glyphicon glyphicon-remove-sign' onclick='removeNote(event)'></a></td></tr>"
    }
    tbody.innerHTML = str;
    checkTable();
}

function appendNote(formData, id) {
    var table = document.querySelector("table");
    var tbody = table.querySelector('tbody');
    var tr = document.createElement('tr');

    var str = "<td>" + formData.get('name') + "</td><td>" + formData.get('lname') + "</td><td>" + formData.get('email') + "</td>";
    str += "<td><a href='#' class='glyphicon glyphicon-pencil' onclick='editNote(event)'></a><a href='#' " +
        "class='glyphicon glyphicon-remove-sign' onclick='removeNote(event)'></a></td>";
    tr.setAttribute('id', id);
    tr.innerHTML = str;
    tbody.appendChild(tr);
    toogleForm('new');
    checkTable();
}

function checkTable() {
    var table = document.querySelector("table");
    var tr = table.querySelector('tbody').querySelector('tr');
    if (tr) {
        table.classList.contains('hidden') ? table.classList.remove('hidden') : '';
    }
    else {
        table.classList.add('hidden');
    }
}

function toogleForm(attr) {
    var form = document.forms.person;
    form.dataset.action = attr;
    form.classList.toggle('hidden');
    if (form.querySelectorAll('.invalid-form')) {
        var fields = form.querySelectorAll('.invalid-form');
        for (var i = 0; i < fields.length; i++) {
            fields[i].classList.remove('invalid-form');
        }
    }
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}