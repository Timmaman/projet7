function user() {
    let infos = sessionStorage.getItem('user');
    if (infos == undefined) {
        alert("Vous n'êtes pas connecté!")
        document.location.href = "login.html";
    } else {
        return infos
    }
}

function msgSelect() {
    let messageId = sessionStorage.getItem('message')
    if (messageId == undefined) {
        document.location.href = "index.html";
    } else {
        return messageId
    }
}

async function message() {
    try {
        let infos = user()
        let messageId = msgSelect()
        response = await fetch("http://localhost:3000/api/message/" + messageId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': infos
            },
            mode: 'cors',
        })

        let message = await response.json()
        const child = document.getElementById('message')

        //Creation du username
        const name = document.createElement('h3')
        child.append(name);
        name.innerHTML += message.User.username;

        //Creation du titre
        const title = document.createElement('h4')
        child.append(title);
        title.id = "title";
        title.innerHTML += message.title;

        //Creation du texte
        const content = document.createElement('p');
        child.append(content);
        content.id = "content";
        content.innerHTML += message.content;
        updateMsg(message)

        if (message.imageUrl != undefined) {
            const image = document.createElement('img')
            child.append(image)
            image.src = message.imageUrl
        }

        const like = document.createElement('p')
        child.append(like);
        like.id = message.id;
        like.className = 'like'
        like.addEventListener('click', function(e) {
            likeMessage()
        })
        let liked = message.likes;
        liked += " J'aime"
        like.innerHTML += liked;

        //Affichage des commentaires
        if (message.Comments !== undefined) {
            let count = message.Comments.length
            for (i = 0; i < count; i++) {
                const comment = document.getElementById('comments')
                let comContent = message.Comments[i].content
                let comUser = message.Comments[i].User.username
                const displayComContent = document.createElement('p');
                const displayComUser = document.createElement('h5');
                comment.append(displayComUser);
                comment.append(displayComContent);
                displayComContent.id = message.Comments[i].id
                displayComContent.value = comContent
                displayComContent.addEventListener('click', function(e) {
                    updelCom()
                })
                displayComUser.innerHTML += comUser;
                displayComContent.innerHTML += comContent;
            }
        }
    } catch (error) {
        sessionStorage.removeItem('message');
        document.location.href = "index.html";
    }
}

function updateMsg(message) {
    try {
        var updateButton = document.getElementById('updateDetails');
        var favDialog = document.getElementById('msgDialog');
        let newContent = document.getElementById('newContent')
        let newTitle = document.getElementById('newTitle')

        newContent.value = message.content
        newTitle.value = message.title

        updateButton.addEventListener('click', function onOpen() {
            if (typeof favDialog.showModal === "function") {
                favDialog.showModal();

            } else {
                alert("L'API dialog n'est pas prise en charge par votre navigateur");
            }
        });

        favDialog.addEventListener('close', async function onClose() {
            let infos = user()
            let id = msgSelect()
            let update = new Object();
            update.title = newTitle.value;
            update.content = newContent.value;
            console.log(update)
            response = await fetch("http://localhost:3000/api/message/update/" + id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': infos
                },
                mode: 'cors',
                body: JSON.stringify(update),
            })
            let answer = await response.json();
            if (response.status === 201) {
                window.location.reload()
            } else {
                alert(answer.message)
            }
        });
    } catch (error) {
        window.location.reload()
    }
}


async function deleteMsg() {
    let infos = user();
    let id = msgSelect()
    response = await fetch("http://localhost:3000/api/message/delete/" + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': infos
        },
        mode: 'cors',
    })
    let post = await response.json();
    alert(post.message)
    if (response.status === 201) {
        sessionStorage.removeItem('message')
        document.location.href = 'index.html';
    } else {
        window.location.reload()
    }

}

async function comment() {
    try {
        let infos = user();
        let id = msgSelect()
        let com = document.getElementById('comment')
        let comment = new Object;
        comment.content = com.value
        response = await fetch("http://localhost:3000/api/comment/" + id, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': infos
            },
            mode: 'cors',
            body: JSON.stringify(comment),
        })
        let post = await response.json()
        if (response.status === 201) {
            window.location.reload()
        } else {
            alert(post.message)
        }
    } catch (error) {
        alert('impossible de commenter')
        window.location.reload()
    }
}

function updelCom() {
    let infos = user();
    let messageid = msgSelect();
    let id = event.currentTarget.getAttribute('id');
    let comContent = event.currentTarget.value;
    let modifCom = document.getElementById('newComContent')
    modifCom.value = comContent
    let Dialog = document.getElementById('comDialog');

    if (typeof Dialog.showModal === "function") {
        Dialog.showModal();
    } else {
        alert("L'API dialog n'est pas prise en charge par votre navigateur");
    }
    let supp = document.getElementById('delete')
    supp.addEventListener('click', async function deleteCom() {
        response = await fetch("http://localhost:3000/api/comment/delete/" + messageid + '/' + id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': infos
            },
            mode: 'cors',
        })
        let post = await response.json();
        alert(post.message)
        window.location.reload()
    })
    let modify = document.getElementById('update')
    modify.addEventListener('click', async function updateCom() {
        let updateCom = new Object()
        updateCom.content = modifCom.value
        response = await fetch("http://localhost:3000/api/comment/update/" + messageid + '/' + id, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': infos
            },
            mode: 'cors',
            body: JSON.stringify(updateCom),
        })
        let post = await response.json();
        alert(post.message)
        window.location.reload()
    })
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