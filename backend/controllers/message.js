const models = require('../models')
const auth = require('../middlewares/auth')
const fs = require('fs');
const regex = /[a-zA-Z]/;
const limit_title = 3
const limit_content = 5


exports.newMessage = (req, res) => {
    const msgObject = JSON.parse(req.body.message)
    let headerAuth = req.headers['authorization'];;
    let userId = auth.getUserId(headerAuth).userId;

    models.User.findOne({
        where: { id: userId }
    }).then((user) => {
        if (!user) {
            return res.status(401).json({
                message: 'Utilisateur non trouvé !'
            });
        } else {
            if (!regex.test(msgObject.content) || !regex.test(msgObject.title)) {
                res.status(401).json({
                    message: "Merci de tout compléter pour pouvoir poster",
                    'error': 'invalid parameters'
                });
            } else {
                if (req.body.image === 'undefined') {
                    models.Message.create({
                        ...msgObject,
                        likes: 0,
                        UserId: userId
                    })
                    return res.status(201).json({
                        message: 'Message publié!'
                    })
                } else {
                    models.Message.create({
                        ...msgObject,
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                        likes: 0,
                        UserId: userId
                    })
                    return res.status(201).json({
                        message: 'Message publié!'
                    })
                }
            }
        }

    }).catch(error => res.status(500).json({
        error: error,
        message: 'Impossible de poster le message'
    }))
};

exports.getAllMessages = (req, res) => {
    let limit = req.body.limit;
    var order = req.query.order;
    if (limit === undefined) {
        limit = 15;
    }
    models.Message.findAll(({
            order: [(order != null) ? order.split(':') : ['id', 'DESC']],
            limit: (!isNaN(limit)) ? limit : null,
            include: [{
                model: models.User,
                attributes: ['username']
            }]
        }))
        .then((messages) => { res.status(200).json(messages); })
        .catch((error) => {
            res.status(400).json({
                error: error,
                message: 'Impossible de récupérer les messages'
            });
        });
};

exports.updateMessage = (req, res) => {
    const messageId = req.params.id;
    let headerAuth = req.headers['authorization'];
    let token = auth.getUserId(headerAuth);
    let userId = token.userId;
    let admin = token.isAdmin
    const title = req.body.title;
    const content = req.body.content;

    models.Message.findOne({ where: { id: messageId } })
        .then(async function(message) {

            let newTitle
            if (title === undefined) {
                newTitle = message.title;
            } else {
                newTitle = title
            }
            if (content === undefined) {
                newContent = message.content;
            } else {
                newContent = content;
            }

            if (newTitle.length <= limit_title || newContent.length <= limit_content) {
                return res.status(400).json({
                    message: "Paramètres invalides",
                    'error': 'invalid parameters'
                });
            } else {
                if (message.userId == userId || admin === true) {
                    message.update({ title: message.title = title, content: message.content = content })
                    return res.status(201).json({
                        message: 'Message modifié'
                    })
                } else {
                    console.log('coucou')
                    return error
                }
            }
        }).catch((error) => {
            res.status(400).json({
                error: error,
                message: 'Vous ne pouvez pas modifier ce message'
            });
        });
}

exports.deleteMessage = (req, res) => {
    const messageId = req.params.id;
    let headerAuth = req.headers['authorization'];
    let token = auth.getUserId(headerAuth);
    let userId = token.userId;
    let admin = token.isAdmin
    console.log(admin)
    models.Message.findOne({ where: { id: messageId } })
        .then(async function(message) {
            if (!message) {
                return error
            } else {
                if (message.userId == userId || admin === true) {
                    {
                        try {
                            let liked = await models.Like.findAndCountAll({ where: { messageId: messageId } })
                            let likecount = await liked.count;
                            console.log(likecount)
                            for (let i = 0; i < likecount; i++) {
                                let likes = await models.Like.findOne({ where: { messageId: messageId } });
                                likes.destroy();
                            }
                            let commented = await models.Comment.findAndCountAll({ where: { messageId: messageId } });
                            let commentcount = await commented.count;
                            for (let i = 0; i < commentcount; i++) {
                                let comment = await models.Comment.findOne({ where: { messageId: messageId } });
                                comment.destroy();
                            }
                            const filename = message.imageUrl.split('/images/')[1];
                            fs.unlink(`images/${filename}`, () => {
                                message.destroy();
                                return res.status(201).json({ message: 'Message supprimé' });
                            })

                        } catch (error) {
                            return error;
                        }
                    }
                } else {
                    return error
                }
            }

        }).catch((error) => {
            res.status(400).json({
                error: error,
                message: 'Vous ne pouvez pas supprimer ce message'
            });
        });

};

exports.getOneMessage = (req, res) => {

    models.Message.findOne({
            where: { id: req.params.id },
            include: [{
                    model: models.User,
                    attributes: ['username']
                },
                {
                    model: models.Comment,
                    attributes: ['content', 'id'],
                    include: [{
                        model: models.User,
                        attributes: ['username']
                    }]
                }
            ]
        })
        .then(message => { res.status(200).json(message); })
        .catch((error) => {
            res.status(400).json({
                error: error,
                message: 'Impossible de récupérer le messages'
            });
        });

}