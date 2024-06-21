export class NumberUtil {
    // Вернет случайное число от мин до макс включительно
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}