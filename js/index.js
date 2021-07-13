const baseBackURL = 'http://localhost:8080/users';
const baseFrontURL = 'http://localhost:63342/library-front/index.html';

const tbody = document.querySelector('tbody');
const createBtn = document.querySelector('.btn-createUser');
const wrapper = document.querySelector('.wrapper');
let tbodyBook;

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
    initActionsButtons();
}

async function getUserById(userId) {
    let response = await fetch(baseBackURL + '/' + userId);
    if (response.ok) { // если HTTP-статус в диапазоне 200-299
        // получаем тело ответа
        return await response.json();
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}

async function editUser(userId) {
    let user_first_name = document.querySelector('.first_name-edit').value;
    let user_last_name = document.querySelector('.last_name-edit').value;
    let user_email = document.querySelector('.email-edit').value;

    let data = {
        first_name: user_first_name,
        last_name: user_last_name,
        email: user_email
    };

    try {
        const response = await fetch(baseBackURL + '/' + userId, {
            method: 'PUT',
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

// Форма для изменения клиента
async function showEditUserForm(e) {
    let userId = getId(e);
    let user = await getUserById(userId);

    wrapper.innerHTML =
        '<h1>Обновление клиента</h1>' +
        '<div class="form-group row gy-2">' +
        ' <label for="formGroupExampleInput">First Name</label>' +
        '<input name="first_name" type="text" class="form-control first_name-edit"> </div>' +
        '<div class="form-group row gy-2">' +
        ' <label for="formGroupExampleInput">Last Name</label>' +
        '<input name="last_name" type="text" class="form-control last_name-edit"> </div>' +
        '<div class="form-group row gy-2">' +
        ' <label for="formGroupExampleInput">Email</label>' +
        '<input name="email" type="email" class="form-control email-edit"> </div>' +
        '<br><button class="btn btn-primary btn-editUserFromData">Изменить</button><br>'
    ;

    let first_name = document.querySelector('.first_name-edit');
    let last_name = document.querySelector('.last_name-edit');
    let email = document.querySelector('.email-edit');

    first_name.value = user.first_name;
    last_name.value = user.last_name;
    email.value = user.email;

    let btn_editUserFromData = document.querySelector(".btn-editUserFromData");

    btn_editUserFromData.addEventListener('click', function () {
        editUser(userId)
    });
    btn_editUserFromData.addEventListener('click', backToMain);
}

async function getAllUsers() {
    let response = await fetch(baseBackURL);
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
        '<button class="btn btn-primary btn-getBooks" type="button">Take Books</button>'
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

    let data = {
        first_name: user_first_name,
        last_name: user_last_name,
        email: user_email
    };

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

// Удаление user
async function deleteUser(e) {
    let userId = getId(e);

    await fetch(baseBackURL + '/' + userId, {method: 'DELETE'});

    backToMain();
}

async function showBooks(e) {
    let userId = getId(e);
    wrapper.innerHTML = ' <table class="table">\n' +
        '    <thead>\n' +
        '    <tr>\n' +
        '      <th scope="col">#</th>\n' +
        '      <th scope="col">Name</th>\n' +
        '      <th scope="col">Author</th>\n' +
        '      <th scope="col">Genres</th>\n' +
        '      <th scope="col">Actions</th>\n' +
        '    </tr>\n' +
        '    </thead>\n' +
        '    <tbody>\n' +
        '    </tbody>\n' +
        '  </table>\n' +
        '\n' +
        '  <button class="btn btn-primary btn-back"><a>Back to Main</a></button>';

    tbodyBook = document.querySelector('tbody');
    let books = await getAllBooks();
    let i = 1;
    for (let book of books) {
        let tr = createBookTR(book);
        tr.classList.toggle('row-' + i++);
        tbodyBook.appendChild(tr);
    }
    initBookActionButtons(userId);
}

async function getAllBooks() {
    let response = await fetch('http://localhost:8080/books');
    if (response.ok) { // если HTTP-статус в диапазоне 200-299
        // получаем тело ответа
        return await response.json();
    } else {
        alert("Ошибка HTTP: " + response.status);
    }
}

function createBookTR(book) {
    let tr = document.createElement('tr');
    // id
    let td1 = document.createElement('td');
    // Name
    let td2 = document.createElement('td');
    // Author
    let td3 = document.createElement('td');
    // Genres
    let td4 = document.createElement('td');
    // actions
    let td5 = document.createElement('td');
    td1.textContent = book.id;
    td2.textContent = book.name;
    td3.textContent = book.author.name;
    let genres = book.genres;
    for (let genre of genres) {
        td4.textContent += genre.name;
        td4.textContent += ' ';
    }

    td5.innerHTML =
        '<div class="btn-group action-buttons" role="group" aria-label="Basic example">' +
        '<a class="btn btn-primary btn-takeBook" role="button">Take Book</a>' +
    '</div>';
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    return tr;
}

async function takeBook(e) {
    let userId = e.currentTarget.userId;
    let bookId = getId(e);
    let url = baseBackURL + '/' + userId + '/books/' + bookId;

    await fetch(url);
}

// Возвращает на начальную страницу
function backToMain() {
    window.location.href = baseFrontURL;
}

function getId(e) {
    console.log(e);
    let actionButton = e.target;
    let actionButtons = actionButton.parentElement;
    let td = actionButtons.parentElement;
    let tr = td.parentElement;
    return tr.querySelector('td').textContent;
}

function initActionsButtons() {
    let editButtons = document.querySelectorAll('.btn-editUser');
    editButtons.forEach(btn => {
        btn.addEventListener('click', showEditUserForm);
    });
    let deleteButtons = document.querySelectorAll('.btn-deleteUser');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', deleteUser);
    });
    let getBooksButtons = document.querySelectorAll('.btn-getBooks');
    getBooksButtons.forEach(btn => {
        btn.addEventListener('click', showBooks);
    });
}

function initBookActionButtons(userId) {
    let backbtn = document.querySelector('.btn-back');
    backbtn.addEventListener('click', backToMain);
    let takeBookButtons = document.querySelectorAll('.btn-takeBook');
    takeBookButtons.forEach(btn => {
        btn.addEventListener('click', takeBook);
        btn.userId = userId;
    });
}