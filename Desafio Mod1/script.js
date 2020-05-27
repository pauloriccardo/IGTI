let globalAllUsers = []; // array contendo todos os usuarios retornados pela api
let globalInputName = '';
let globalButton = '';
let globalSearchedUser = '';
let globalFilteredUsers = [];
let globalNumberUsersFind = 0;

window.addEventListener('load', () => {
    globalInputName = document.querySelector('#name');
    globalButton = document.querySelector('.btn');
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
    processInput();
}

function handleTyping(event) {
    if (event.key === 'Enter') {
        globalSearchedUser = event.target.value;
        processInput();
    }
}

function processInput() {
    if (globalSearchedUser.trim() !== '') {
        userSearch();
    } else {
        renderEmpty();
    }
    clearInput();
}

function userSearch() {
    globalFilteredUsers = globalAllUsers.filter((user) =>
        user.name.toLowerCase().includes(globalSearchedUser)
    );
    if (globalFilteredUsers.length === 0) {
        renderEmpty();
    } else {
        renderSearched();
        renderStatistics();
    }
}

function renderEmpty() {
    users.innerHTML = '<h2>Nenhum usuário encontrado</h2>';
    statistics.innerHTML = '<h2>Nada a ser exibido</h2>';
}

function renderSearched() {
    globalNumberUsersFind = globalFilteredUsers.length;
    let resHTML = `<h2>${globalNumberUsersFind} Usuario(s) Encontrado(s)</h2>
                    <ul>`;
    globalFilteredUsers.forEach((user) => {
        const { name, picture, age, gender } = user;
        let personHTML = `
            <li>
                <img src="${picture}" alt="${name}" />
                <span>${name} ${age}</span>
            </li>`;

        resHTML += personHTML;
    });
    resHTML += '</ul>';
    users.innerHTML = resHTML;
}

function renderStatistics() {
    let male = 0;
    let female = 0;

    const sumAge = globalFilteredUsers.reduce((accumulator, current) => {
        return accumulator + current.age;
    }, 0);

    const avaregeAge = (sumAge / globalNumberUsersFind).toFixed(2);

    globalFilteredUsers.forEach((person) => {
        if (person.gender === 'male') {
            male++;
        } else {
            female++;
        }
    });

    resHTML = `
            <h2>Estatíticas</h2>
            <ul>
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
