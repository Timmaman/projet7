function user() {
    let infos = sessionStorage.getItem('user');
    if (infos == undefined) {
        alert("Vous n'êtes pas connecté!")
        document.location.href = "login.html";
    } else {
        return infos
    }
}

async function message() {
    let infos = await user();
    response = await fetch("http://localhost:3000/api/message/", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': infos
        },
        mode: 'cors',
    });
    let messages = await response.json();
    console.log(message)
    return messages;
}

message().then(function(messages) {
    for (let message of messages) {
        console.log(message)
        const parent = document.getElementById('messages');
        const parentbis = document.createElement('div');
        parent.append(parentbis);
        parentbis.id = 'div' + message.id;
        const new_child = document.getElementById('div' + message.id)
        const new_parent = document.createElement("a");
        new_child.append(new_parent);
        new_parent.addEventListener('click', function(e) {
            seeMessage()
        })
        new_parent.id = message.id;

        //Creation du username
        const child = document.getElementById(message.id);
        const name = document.createElement('h3')
        child.append(name);
        name.innerHTML += message.User.username;

        //Creation du titre
        const title = document.createElement('h4')
        child.append(title);
        title.id = "title";
        title.innerHTML += message.title;

        //Affichage de l'image
        if (message.imageUrl != undefined) {
            const image = document.createElement('img')
            child.append(image)
            image.src = message.imageUrl
        }

        //Creation du texte
        const content = document.createElement('p');
        child.append(content);
        content.id = "content";
        content.innerHTML += message.content;

        //Creation du like
        const like = document.createElement('p')
        new_child.append(like);
        like.id = message.id;
        like.className = 'like'
        like.addEventListener('click', function(e) {
            likeMessage()
        })
        let liked = message.likes;
        liked += " J'aime"
        like.innerHTML += liked;
    }
})


async function postMessage() {
    let infos = user()
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    let img = document.getElementById('img').files[0]
    let message = new Object();
    message.title = title;
    message.content = content;
    var test = new FormData()
    test.append('message', JSON.stringify(message))
    test.append('image', img)
    response = await fetch("http://localhost:3000/api/message/new", {
        method: 'POST',
        headers: {
            'Accept': 'application/json; ',
            'Authorization': infos
        },
        mode: 'cors',
        body: test
    })

    let post = await response.json();
    alert(post.message);
    if (response.status == 201) {
        window.location.reload()
    }
}

async function likeMessage() {
    try {
        infos = user()
        let data = event.currentTarget.getAttribute('id');
        let like = new Object();
        like.messageId = data;
        response = await fetch("http://localhost:3000/api/message/like", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': infos
            },
            mode: 'cors',
            body: JSON.stringify(like),
        })
        window.location.reload()
    } catch (error) {
        alert('Impossible de liker le message')
        window.location.reload()
    }
}

async function seeMessage() {
    infos = user()
    let data = event.currentTarget.getAttribute('id');
    sessionStorage.setItem('message', data);
    document.location.href = 'message.html'
}

function disconnect() {
    sessionStorage.removeItem('user')
    document.location.href = 'login.html'
    alert('Vous avez été déconnecté')
}