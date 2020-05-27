let globalAllUsers = []; // array contendo todos os usuarios retornados pela api
let globalInputName = '';
let globalButton = '';
let globalSearchedUser = '';
let globalFilteredUsers = [];

window.addEventListener('load', () => {
    globalInputName = document.querySelector('#name');
    globalButton = document.querySelector('#search');
    dataGet();
    activateInput();
});

//prettier-ignore
async function dataGet() {
    const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    const json = await res.json();

    globalAllUsers = json.results.map((user) => {
        const { name, picture, dob, gender } = user;
        return {
            name: name.first + ' ' + name.last,
            picture: picture.medium, 
            age: dob.age,
            gender,
        }
    });    
}

function activateInput() {
    globalInputName.focus();
    globalButton.addEventListener('click', handleButtonClick);
    globalInputName.addEventListener('keyup', handleTyping);
}

function handleButtonClick(event) {
    globalSearchedUser = event.path[1].childNodes[1].value;
    if (globalSearchedUser.trim() !== '') {
        userSearch();
    } else {
        renderEmpty();
    }
    clearInput();
}

function handleTyping(event) {
    if (event.key === 'Enter') {
        globalSearchedUser = event.target.value;
        if (globalSearchedUser.trim() !== '') {
            userSearch();
        } else {
            renderEmpty();
        }
        clearInput();
    }
}

function userSearch() {
    globalFilteredUsers = globalAllUsers.filter((user) =>
        user.name.toLowerCase().includes(globalSearchedUser)
    );

    if (globalFilteredUsers.length === 0) {
        renderEmpty();
    } else {
        renderSearched();
    }
}

function renderEmpty() {
    let resHTML = `<h2>Nenhum usuário a ser exibido</h2>`;
    title.innerHTML = resHTML;
    clearInput();
}

function renderSearched() {
    let resHTML = '<div id="usersList">';
    globalFilteredUsers.forEach((user) => {
        const { name, picture, age, gender } = user;
        let personHTML = `
            <img src="${picture}" alt="${name}" />
            <span>${name} ${age}</span>`;

        resHTML += personHTML;
    });
    resHTML += '</div>';
    users.innerHTML = resHTML;
    renderStatistics();
}

function renderStatistics() {
    const numberUsers = globalFilteredUsers.length;
    let male = 0;
    let female = 0;

    let resHTML = `<h2>${numberUsers} Usuario(s) Encontrado(s)</h2>`;
    title.innerHTML = resHTML;

    const sumAge = globalFilteredUsers.reduce((accumulator, current) => {
        return accumulator + current.age;
    }, 0);

    const avaregeAge = sumAge / numberUsers;

    globalFilteredUsers.forEach((person) => {
        if (person.gender === 'male') {
            male++;
        } else {
            female++;
        }
    });

    resHTML = `
        <div id="usersStatistics">
            
            <ul><h3>Estatíticas</h3>
                <li>Sexo Masculino: ${male}</li>
                <li>Sexo Feminino: ${female}</li>
                <li>Soma das Idades: ${sumAge}</li>
                <li>Media das idades: ${avaregeAge}</li>
            </ul>
        </div>`;

    statistics.innerHTML = resHTML;
}

function clearInput() {
    globalInputName.value = '';
    globalInputName.focus();
}
