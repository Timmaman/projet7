const bcrypt = require('bcryptjs');
var auth = require('../middlewares/auth');
const models = require('../models');

const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

//Création d'un utilisateur
exports.signup = (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const departement = req.body.departement;
    const fonction = req.body.fonction;
    const email = req.body.email;
    const password = req.body.password;
    if (!regex.test(email)) {
        res.status(401).json({
            message: 'Votre adresse mail est invalide',
            error: 'Wrong email'
        });
    } else {
        models.User.findOne({
                where: { email: email }
            })
            .then(findUser => {
                if (findUser) {
                    return res.status(409).json({
                        message: 'Cet utilisateur est déjà enregistré',
                        error: 'This user already exists'
                    });
                } else {
                    const count = password.length;
                    if (count < 8) {
                        res.status(401).json({
                            message: 'Votre mot de passe doit au moins faire 8 caractères',
                            error: 'Low Password'
                        });
                    } else {
                        bcrypt.hash(password, 10)
                            .then(hash => {
                                let username = firstName;
                                username += ' '
                                username += lastName;
                                models.User.create({
                                    firstName: firstName,
                                    lastName: lastName,
                                    username: username,
                                    departement: departement,
                                    fonction: fonction,
                                    email: email,
                                    password: hash,
                                    isAdmin: false,
                                });
                                res.status(201).json({ message: 'Utilisateur créé !' })
                            })
                    }
                }
            }).catch(error => res.status(500).json({
                message: "Impossible d'ajouter l'utilisateur",
                error: error
            }));
    }
};

//Connexion d'un utilisateur déjà inscrit
exports.login = (req, res) => {

    // Params
    var email = req.body.email;
    var password = req.body.password;

    if (email == null || password == null) {
        return res.status(400).json({
            message: 'Merci de compléter tous les champs',
            error: 'missing parameters'
        });
    } else {
        models.User.findOne({ where: { email: email } })
            .then(user => {
                if (!user) {
                    return error
                } else {
                    bcrypt.compare(password, user.password)
                        .then(valid => {
                            if (!valid) {
                                return res.status(403).json({ message: 'Mot de passe incorrect !' });
                            }
                            res.status(200).json({
                                message: 'Connexion réussie',
                                token: auth.generateToken(user)
                            })

                        })

                }
            }).catch(error => res.status(401).json({ message: 'Utilisateur non trouvé', error: error }));
    }
};


//MAJ d'un User
exports.updateUser = (req, res) => {

    let headerAuth = req.headers['authorization'];;
    let userId = auth.getUserId(headerAuth).userId;

    const departement = req.body.departement;
    const fonction = req.body.fonction;
    models.User.findOne({
        where: { id: userId }
    }).then(user => {
        if (!user) {
            return error
        } else {
            user.update({ departement: user.departement = departement, fonction: user.fonction = fonction })
            return res.status(201).json({ message: 'Utilisateur mis à jour!' })
        }
    }).catch(error => res.status(500).json({ message: "Impossible de modifier l'utilisateur", error: error }));
};

// Suppression d'un user
exports.deleteUser = (req, res) => {
    let headerAuth = req.headers['authorization'];;
    let userId = auth.getUserId(headerAuth).userId;
    models.User.findOne({ where: { id: userId } })
        .then(async function(user) {
            if (!user) {
                return error
            } else {
                try {
                    let liked = await models.Like.findAndCountAll({ where: { userId: userId } })
                    let likecount = await liked.count;
                    console.log(likecount)
                    for (let i = 0; i < likecount; i++) {
                        let likes = await models.Like.findOne({ where: { userId: userId } });
                        let message = await models.Message.findOne({ where: { id: likes.messageId } });
                        message.update({ likes: message.likes += -1 });
                        likes.destroy();
                    }
                    let commented = await models.Comment.findAndCountAll({ where: { userId: userId } });
                    let commentcount = await commented.count;
                    for (let i = 0; i < commentcount; i++) {
                        let comment = await models.Comment.findOne({ where: { userId: userId } });
                        comment.destroy();
                    }
                    let messages = await models.Message.findAndCountAll({ where: { userId: userId } });
                    let messagecount = await messages.count;
                    for (let i = 0; i < messagecount; i++) {
                        let message = await models.Message.findOne({ where: { userId: userId } });
                        message.destroy();
                    }
                    user.destroy();
                    return res.status(201).json({ message: 'Compte supprimé' });
                } catch (error) {
                    return error;
                }
            }
        })
        .catch(error => res.status(401).json({ message: 'Impossible de supprimer le compte', error: error }));
}

// Affichage d'un profil
exports.getUserProfile = (req, res) => {

    let headerAuth = req.headers['authorization'];;
    let userId = auth.getUserId(headerAuth).userId;

    models.User.findOne({
            where: { id: userId },
            attributes: ['departement', 'email', 'username', 'fonction']
        })
        .then(user => {
            console.log(user.username);
            if (user) {
                return res.status(200).json(user);
            } else { return error }
        }).catch(error => res.status(400).json({
            message: "Impossible d'afficher l'utilisateur",
            error: error
        }))
}