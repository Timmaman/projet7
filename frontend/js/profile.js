function user() {
    let infos = sessionStorage.getItem('user');
    if (infos == undefined) {
        alert("Vous n'êtes pas connecté!")
        document.location.href = "login.html";
    } else {
        return infos
    }
}

async function profile() {
    try {
        let infos = await user()
        response = await fetch("http://localhost:3000/api/user/profile", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': infos
            },
            mode: 'cors',
        })
        let profile = await response.json();

        console.log(profile);

        let username = document.getElementById('username');
        username.innerHTML += profile.username;
        let email = document.getElementById('email');
        email.innerHTML += profile.email;
        let dep = document.getElementById('oldDept');
        let test = document.getElementsByTagName('option');
        for (i = 1; i < test.length; i++) {
            console.log(test[i].value)
            if (test[i].value === profile.departement) {
                test[0].value = profile.departement;
                while (test[i].firstChild) { test[i].removeChild(test[i].firstChild); }
            }
        }

        dep.innerHTML += profile.departement

        let fonction = document.getElementById('fonction');
        fonction.value = profile.fonction;
    } catch (error) {
        document.location.href = "index.html";
    }
}

async function update() {
    try {
        infos = user()
        let departement = document.getElementById("departement").value;
        let fonction = document.getElementById("fonction").value;
        let update = new Object()
        update.departement = departement;
        update.fonction = fonction;
        response = await fetch("http://localhost:3000/api/user/update", {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': infos
            },
            mode: 'cors',
            body: JSON.stringify(update),
        })

        let ok = await response.json();
        alert(ok.message);
        document.location.href = 'index.html';
    } catch (error) {
        alert('impossible de modifier le profil')
        window.location.reload()
    }
}

async function deleteUser() {
    infos = user()
    response = await fetch("http://localhost:3000/api/user/delete", {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': infos
        },
        mode: 'cors',
    })
    let ok = await response.json();
    alert(ok.message);
    if (response.status === 201) {
        sessionStorage.removeItem('user')
        document.location.href = 'singin.html';
    }

}