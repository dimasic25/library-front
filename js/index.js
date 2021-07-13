const baseBackURL = 'http://localhost:8080/users';
const baseFrontURL = 'http://localhost:63342/library-front/index.html';

const tbody = document.querySelector('tbody');
const createBtn = document.querySelector('.btn-createUser');
const wrapper = document.querySelector('.wrapper');

document.addEventListener('DOMContentLoaded', showAllUsers);
createBtn.addEventListener('click', showCreateClientForm);

async function showAllUsers() {
    let users = await getAllUsers();
    let i = 1;
    for (let user of users) {
        let tr = createTR(user);
        tr.classList.toggle('row-' + i++);
        tbody.appendChild(tr);
    }
}

async function getAllUsers() {
    return (await fetchData(baseBackURL));
}

async function fetchData(url) {
    let response = await fetch(url);
    if (response.ok) { // если HTTP-статус в диапазоне 200-299
        // получаем тело ответа
        return await response.json();
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}

function createTR(user) {
    let tr = document.createElement('tr');
    // id
    let td1 = document.createElement('td');
    // First Name
    let td2 = document.createElement('td');
    // Last Name
    let td3 = document.createElement('td');
    // email
    let td4 = document.createElement('td');
    // actions
    let td5 = document.createElement('td');
    td1.textContent = user.id;
    td2.textContent = user.first_name;
    td3.textContent = user.last_name;
    td4.textContent = user.email;
    td5.innerHTML =
        '<div class="btn-group action-buttons" role="group" aria-label="Basic example">' +
        '<a class="btn btn-primary btn-editUser" role="button">Edit</a>' +
        '<button type="submit" class="btn btn-danger btn-deleteUser">Delete</button>' +
        '</div>';
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    return tr;
}

// Форма для создания клиента
function showCreateClientForm() {
    wrapper.innerHTML =
        '<h1>Создание клиента</h1>' +
        '<div class="form-group row gy-2">' +
        ' <label for="formGroupExampleInput">First Name</label>' +
        '<input name="first_name" type="text" class="form-control first_name-input" placeholder="Имя"> </div>' +
        '<div class="form-group row gy-2">' +
        ' <label for="formGroupExampleInput">Last Name</label>' +
        '<input name="last_name" type="text" class="form-control last_name-input" placeholder="Фамилия"> </div>' +
        '<div class="form-group row gy-2">' +
        ' <label for="formGroupExampleInput">Email</label>' +
        '<input name="email" type="email" class="form-control email-input" placeholder="Электронная почта"> </div>' +
        '<br><button class="btn btn-primary btn-createUserFromData">Создать</button><br>'
    ;

    let btn_createUserFromData = document.querySelector(".btn-createUserFromData");

    btn_createUserFromData.addEventListener('click', createUser);
    btn_createUserFromData.addEventListener('click', backToMain);
}

async function createUser() {
    let user_first_name = document.querySelector('.first_name-input').value;
    let user_last_name = document.querySelector('.last_name-input').value;
    let user_email = document.querySelector('.email-input').value;

    let data = { first_name: user_first_name,
    last_name: user_last_name,
    email: user_email};

    try {
        const response = await fetch(baseBackURL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        console.log('Успех:', JSON.stringify(json));
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

function backToMain() {
    window.location.href = baseFrontURL;
}
