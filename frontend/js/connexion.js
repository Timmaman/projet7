function clear() {
    sessionStorage.clear();
}

async function singin() {

    let lastName = document.getElementById("lastName").value;
    let firstName = document.getElementById("firstName").value;
    let departement = document.getElementById("departement").value;
    let fonction = document.getElementById("fonction").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (firstName == 0 || lastName == 0 || departement === "none" || fonction == 0 || email == 0 || password == 0) {
        alert("Merci de compléter tous les champs pour pouvoir vous inscrire");
    } else {
        let infos = new Object();
        infos.lastName = lastName;
        infos.firstName = firstName;
        infos.departement = departement;
        infos.fonction = fonction;
        infos.email = email;
        infos.password = password;

        response = await fetch("http://localhost:3000/api/user/signup", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(infos),
        });
        let product = await response.json();
        alert(product.message);
        if (response.status === 201 || response.status === 409) {
            document.location.href = 'login.html';

        }
    }
}

async function login() {
    sessionStorage.clear();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    if (email == 0 || password == 0) {
        alert("Merci de compléter tous les champs pour pouvoir vous connecter");
    } else {
        let connexion = new Object();
        connexion.email = email;
        connexion.password = password;

        response = await fetch("http://localhost:3000/api/user/login", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; ',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(connexion)
        });
        let signin = await response.json();
        alert(signin.message);

        if (response.status === 200) {
            sessionStorage.setItem('user', signin.token);
            document.location.href = 'index.html';

        } else {
            if (response.status === 401) {
                document.location.href = 'singin.html';
            }
        }
    }
}