const bartender = require('../models/bartender');
const logger = require('../utils/logger');

exports.placeOrder = (req, res) => {
    try {
        let { customerId, type } = req.body;
        customerId = customerId.toString().trim();
        type = type.toString().trim();

        if (!customerId) {
            logger.warn(`Invalid customerId. ${customerId}, drink: ${type}`);
            return res.status(400).send({ message: 'Invalid customerId.' });
        }

        if (type !== 'BEER' && type !== 'DRINK') {
            logger.warn(`Invalid drink type. ${customerId}, drink: ${type}`);
            return res.status(400).send({ message: 'Invalid drink type. Please choose either BEER or DRINK.' });
        }

        const { duplicateOrder, orderStage } = bartender.hasActiveOrServedOrder(customerId, type);
        if (duplicateOrder) {
            logger.info(`Duplicate order detected. Customer: ${customerId}, drink: ${type}`);
            return res.status(200).send({ message: `Order already being ${orderStage}` });
        }
        
        if (!bartender.canPrepareDrink(type)) {
            logger.warn(`Bartender is busy. Customer: ${customerId}, drink: ${type}`);
            return res.status(429).send({ message: 'Bartender is busy, please try again later.' });
        }

        const order = { customerId, type, timestamp: new Date() };
        bartender.prepareDrink(order, () => {
            logger.info(`Order completed for customerId: ${customerId}, drink: ${type}`);
        });

        logger.info(`Order accepted for customerId: ${customerId}, type: ${type}`);
        return res.status(200).send({ message: 'Order accepted, your drink is being prepared!' });
    } catch (error) {
        logger.error(`Error placing order: ${error.message}`);
        return res.status(500).send({ message: 'An error occurred while placing the order.' });
    }
};

exports.getServedOrders = (req, res) => {
    try {
        logger.info('Served orders requested');
        const orders = bartender.getServedOrders();
        res.status(200).json(orders);
    } catch (error) {
        logger.error(`Error fetching served orders: ${error.message}`);
        res.status(500).send({ message: 'An error occurred while fetching served orders.' });
    }
};

exports.setPrepTime = (req, res) => {
    try {
        const { prepTime } = req.body;
        if (prepTime && typeof prepTime === 'number' && prepTime > 0) {
            bartender.setPrepTime(prepTime);
            logger.info(`Preparation time set to ${prepTime} seconds`);
            return res.status(200).send({ message: `Preparation time set to ${prepTime} seconds` });
        } else {
            logger.warn('Invalid preparation time');
            return res.status(400).send({ message: 'Invalid preparation time' });
        }
    } catch (error) {
        logger.error(`Error setting preparation time: ${error.message}`);
        return res.status(500).send({ message: 'An error occurred while setting the preparation time.' });
    }
};
