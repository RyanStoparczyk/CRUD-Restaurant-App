// Establishing required nodes
const express = require('express');
const restController = require('../controllers/restController');
const router = express.Router();

router.get('/', restController.getRest);
router.post('/', restController.postRest);

router.get('/:restID', restController.getRestID);
router.put('/:restID', restController.putRestID);
router.delete('/:restID', restController.delRestID);

module.exports = router;
