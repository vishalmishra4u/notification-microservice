const kafka = require('../config/kafka');
const redis = require('../config/redis');
const sendNotification = require('../services/sendNotification');
require('dotenv').config();

const consumer = kafka.consumer({ groupId: 'notification-group' });

