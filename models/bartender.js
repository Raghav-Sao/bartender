class Bartender {
    constructor() {
        this.currentBeers = 0;
        this.currentDrinks = 0;
        this.orderQueue = [];
        this.servedOrders = [];
        this.activeOrders = new Map();
        this.drinkPrepTime = 5;
    }

    canPrepareDrink(type) {
        if (type === 'BEER' && this.currentBeers < 2) {
            return true;
        } else if (type === 'DRINK' && this.currentDrinks < 1) {
            return true;
        }
        return false;
    }

    prepareDrink(order, callback) {
        if (order.type === 'BEER') {
            this.currentBeers++;
        } else {
            this.currentDrinks++;
        }

        this.orderQueue.push(order);
        this.activeOrders.set(order.customerId, order);

        setTimeout(() => {
            this.servedOrders.push(order);
            this.activeOrders.delete(order.customerId);
            if (order.type === 'BEER') {
                this.currentBeers--;
            } else {
                this.currentDrinks--;
            }
            callback();
        }, this.drinkPrepTime * 1000);
    }

    hasActiveOrServedOrder(customerId, type) {
        const activeOrder = this.activeOrders.get(customerId);
        if (activeOrder && activeOrder.type === type) {
            return { duplicateOrder: true, orderStage: 'processed' };
        }

        const servedOrder = this.servedOrders.find(order => order.customerId === customerId && order.type === type);
        if (servedOrder) {
            return { duplicateOrder: true, orderStage: 'served' };
        }

        return { duplicateOrder: false };
    }

    getServedOrders() {
        return this.servedOrders;
    }

    setPrepTime(prepTime) {
        this.drinkPrepTime = prepTime;
    }
}

module.exports = new Bartender();
