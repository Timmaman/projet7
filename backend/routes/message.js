const express = require('express');
const router = express.Router();


const msgCtrl = require('../controllers/message');
const likeCtrl = require('../controllers/like');
const multer = require('../middlewares/multer-config')

router.get('/', msgCtrl.getAllMessages);
router.post('/new', multer, msgCtrl.newMessage);
router.get('/:id', msgCtrl.getOneMessage);
router.put('/update/:id', msgCtrl.updateMessage);
router.delete('/delete/:id', msgCtrl.deleteMessage);


router.post('/like', likeCtrl.likeMessage)

module.exports = router;