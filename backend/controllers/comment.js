const models = require('../models')
const limit_content = 5;
const auth = require('../middlewares/auth');

exports.commentMessage = (req, res) => {
    let headerAuth = req.headers['authorization'];;
    let userId = auth.getUserId(headerAuth).userId;
    const messageId = req.params.id;
    const content = req.body.content;
    if (content == null) {
        return res.status(400).json({
            message: 'Merci compléter votre commentaire',
            error: error
        });
    } else {
        if (content.length <= limit_content) {
            return res.status(400).json({
                message: "Le contenu est trop court",
                'error': 'error'
            });
        } else {
            models.Comment.findOne({
                where: { messageId: messageId, userId: userId }
            }).then(() => {
                models.Comment.create({
                    content: content,
                    MessageId: messageId,
                    UserId: userId
                })
                return res.status(201).json({
                    message: 'Commentaire posté'
                });
            }).catch(error => res.status(500).json({
                message: 'Impossible de commenter',
                'error': error,
            }))
        }
    }
}

exports.updateComment = (req, res) => {
    let headerAuth = req.headers['authorization'];
    let token = auth.getUserId(headerAuth);
    let userId = token.userId;
    let admin = token.isAdmin;
    const messageId = req.params.messageid;
    const comId = req.params.id;
    const content = req.body.content;
    models.Comment.findOne({
        where: { id: comId }
    }).then(async function(comment) {
        if (content.length <= limit_content) {
            return res.status(400).json({
                message: "Le contenu est trop court",
            });
        } else {
            if (messageId != comment.messageId) {
                return error
            } else {
                if (admin == true || userId == comment.userId) {
                    comment.update({ content: comment.content = content })
                    return res.status(201).json({
                        message: 'Commentaire modfié'
                    });
                } else {
                    return error;
                }
            }

        }
    }).catch(error => res.status(500).json({
        error: error,
        message: 'Impossible de modifier le commentaire'
    }))
}

exports.deleteComment = (req, res) => {
    const messageId = req.params.messageid;
    const comId = req.params.id;
    let headerAuth = req.headers['authorization'];
    let token = auth.getUserId(headerAuth);
    let userId = token.userId;
    let admin = token.isAdmin;
    console.log(messageId)
    models.Comment.findOne({
        where: { id: comId }
    }).then(async function(comment) {
        if (comment.messageId != messageId) {
            return error
        } else {
            if (admin == true || userId == comment.userId) {
                comment.destroy()
                return res.status(201).json({
                    message: 'Commentaire supprimé'
                });
            } else {
                return res.status(401).json({
                    message: "Vous n'avez pas le droit de supprimer ce commentaire",
                });
            }
        }
    }).catch(error => res.status(500).json({
        message: 'Impossible de supprimer le commentaire',
        error: error,
    }))
}