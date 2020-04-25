const models = require('../models')
const auth = require('../middlewares/auth')

exports.likeMessage = (req, res) => {
    let headerAuth = req.headers['authorization'];
    let userId = auth.getUserId(headerAuth).userId;
    const messageId = req.body.messageId;
    models.Like.findOne({
        where: { messageId: messageId, userId: userId }
    }).then(liked => {
        if (!liked) {
            models.Like.create({
                MessageId: messageId,
                UserId: userId
            })
            models.Message.findOne({ where: { id: messageId } })
                .then(liked => {
                    liked.update({ likes: liked.likes + 1, })
                })
        } else {
            models.Message.findOne({ where: { id: messageId } })
                .then(liked => {
                    liked.update({ likes: liked.likes - 1, })
                })
            liked.destroy();
        }
        return res.status(201).json({});
    }).catch(error => res.status(500).json({
        error: error,
        message: 'Impossible de liker'
    }))

}