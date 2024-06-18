class NumberUtil {
    // Вернет случайное число от мин до макс включительно
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

const GameStatuses = {
    PENDING: 'pending',
    IN_PROGRESS: 'in-progress',
    FINISHED: 'finished',
    STOPPED: 'stopped'
}

module.exports = {
    NumberUtil,
    GameStatuses
}