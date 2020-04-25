const express = require('express');
const router = express.Router();


const commentCtrl = require('../controllers/comment');


router.post('/:id', commentCtrl.commentMessage)
router.put('/update/:messageid/:id', commentCtrl.updateComment)
router.delete('/delete/:messageid/:id', commentCtrl.deleteComment)

module.exports = router;