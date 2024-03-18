// Establishing required nodes
const express = require('express');
const restController = require('../controllers/restController');
const router = express.Router();

router.get('/', restController.queryParser);
router.get('/', restController.loadRestaurants);
router.get('/', restController.respondRestaurants);

router.post('/', restController.createRestaurant);

router.param('restID', restController.loadSingleRestaurant);
router.get('/:restID', restController.sendSingleRestaurant);
router.put('/:restID', restController.modifyRestaurant);
router.delete('/:restID', restController.deleteRestaurant);

module.exports = router;
