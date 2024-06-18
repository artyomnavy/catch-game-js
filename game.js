const {NumberUtil, GameStatuses} = require("./utils");

class Game {
    // Настройки игры по умолчанию
    #settings = {
        // Количество очков для выйгрыша
        pointsToWin: 10,
        // Размер сетки
        gridSize: {
            columnsCount: 4,    // y
            rowsCount: 4        // x
        },
        // Время, через которое меняется позиция гугла
        googleJumpInterval: 2000
    };
    // Статус
    #status = GameStatuses.PENDING;
    // Счет
    #score = {
        1: {points: 0},
        2: {points: 0},
    }
    #player1;
    #player2;
    #google;
    #googleJumpInterval;

    constructor() {
    }

    get settings() {
        return this.#settings;
    }

    set settings(settings) {
        this.#settings = {
            ...settings
        }

        this.#settings.gridSize = settings.gridSize ? {
            ...this.#settings.gridSize,
            ...settings.gridSize
        } : this.#settings.gridSize;
    }

    get status() {
        return this.#status
    }

    #createUnits() {
        const player1Position = this.#getRandomPosition()

        this.#player1 = new Player(player1Position, 1);

        const player2Position = this.#getRandomPosition( [player1Position]);

        this.#player2 = new Player(player2Position, 2);

        this.#google = new Google()
        this.#moveGoogleToRandomPosition(true)
    }

    #getRandomPosition(notCrossedPositions = []) {
        let newX;
        let newY;

        do {
            // Генерируем случайные координаты
            newX = NumberUtil.getRandomNumber(0, this.#settings.gridSize.columnsCount - 1);
            newY = NumberUtil.getRandomNumber(0, this.#settings.gridSize.rowsCount - 1);
        }
            // Генерируем координаты пока они равны хотя бы одной позиции массива notCrossedPositions
        while (
            notCrossedPositions.some(p => newX === p.x && newY === p.y)
            );

        return new Position(newX, newY);
    }

    async start() {
        if (this.#status === GameStatuses.PENDING) {
            this.#createUnits();
            this.#status = GameStatuses.IN_PROGRESS;
        }

        this.#runGoogleJumpInterval();
    }

    #runGoogleJumpInterval() {
        this.#googleJumpInterval = setInterval(() => {
            this.#moveGoogleToRandomPosition();
        }, this.#settings.googleJumpInterval);
    }

    async stop() {
        clearInterval(this.#googleJumpInterval);
        this.#status = GameStatuses.STOPPED;
    }


    async #finishGame() {
        clearInterval(this.#googleJumpInterval);
        this.#status = GameStatuses.FINISHED;
    }

    #moveGoogleToRandomPosition(excludeGoogle = false) {
        const notCrossedPositions = [
            this.#player1.position,
            this.#player2.position,
        ];

        // Определение учета предыдущей позиции гугла (при наличии)
        if (!excludeGoogle) {
            notCrossedPositions.push(this.#google.position);
        }

        const googlePosition = this.#getRandomPosition(notCrossedPositions);

        this.#google.position = googlePosition;
    }

    get players() {
        return [this.#player1.clone(), this.#player2.clone()];
    }

    get google() {
        return this.#google.clone();
    }

    get score() {
        return this.#score;
    }

    // Проверка новой позиции с учетом границы сетки
    #canMoveOrOutOfBorder(player, delta) {
        const newPosition = player.position.clone();

        if (delta.x) newPosition.x += delta.x;
        if (delta.y) newPosition.y += delta.y;

        if (newPosition.x < 0 ||
            newPosition.x > this.#settings.gridSize.columnsCount) {
            return false;
        }

        if (newPosition.y < 0 ||
            newPosition.y > this.#settings.gridSize.rowsCount) {
            return false;
        }

        return true;
    }

    // Проверка новой позиции с учетом позиции другого игрока
    #canMoveOrOtherPlayerBlocking(movingPlayer, otherPlayer, delta) {
        const newPosition = movingPlayer.position.clone();

        if (delta.x) {
            newPosition.x += delta.x;
        }

        if (delta.y) {
            newPosition.y += delta.y;
        }

        return !otherPlayer.position.equals(newPosition);
    }

    // Проверка поимки гугла игроком и необходимости завершения игры
    #checkGoogleCatching(player) {
        if (player.position.equals(this.#google.position)) {
            this.#score[player.number].points++;

            if (this.#score[player.number].points === this.#settings.pointsToWin) {
                this.#finishGame()
            } else {
                clearInterval(this.#googleJumpInterval)
                this.#moveGoogleToRandomPosition();
                this.#runGoogleJumpInterval();
            }
        }
    }

    // Перемещение игрока
    #movePlayer(player, otherPlayer, delta) {
        const canMoveOrBorder = this.#canMoveOrOutOfBorder(player, delta);
        if (!canMoveOrBorder) return;

        const canMoveOrOtherPlayer = this.#canMoveOrOtherPlayerBlocking(player, otherPlayer, delta);
        if (!canMoveOrOtherPlayer) return;

        if (delta.x) {
            player.position = new Position(player.position.x + delta.x, player.position.y);
        }

        if (delta.y) {
            player.position = new Position(player.position.x, player.position.y + delta.y);
        }

        this.#checkGoogleCatching(player);
    }

    movePlayer1Right() {
        const delta = {x: 1}

        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer1Left() {
        const delta = {x: -1}

        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer1Up() {
        const delta = {y: -1}

        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer1Down() {
        const delta = {y: 1}

        this.#movePlayer(this.#player1, this.#player2, delta)
    }

    movePlayer2Right() {
        const delta = {x: 1}

        this.#movePlayer(this.#player2, this.#player1, delta)
    }

    movePlayer2Left() {
        const delta = {x: -1}

        this.#movePlayer(this.#player2, this.#player1, delta)
    }

    movePlayer2Up() {
        const delta = {y: -1}

        this.#movePlayer(this.#player2, this.#player1, delta)
    }

    movePlayer2Down() {
        const delta = {y: 1}

        this.#movePlayer(this.#player2, this.#player1, delta)
    }
}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Position(this.x, this.y)
    }

    equals(otherPosition) {
        return otherPosition.x === this.x && otherPosition.y === this.y
    }
}

class Unit {
    #position;

    constructor(position) {
        this.#position = position;
    }

    get position() {
        return new Position(this.#position.x, this.#position.y)
    }

    set position(position) {
        this.#position = position
    }

    // Полная копия объекта Player или Google
    clone() {
        return Object.assign(
            new this.constructor(), // создание экземпляра текущего класса (Player или Google)
            this, // ссылка на созданный экземпляр класса в предыдущем параметре (копия с учетом свойств Unit, Player, Google)
            {
                position: this.#position.clone() // копия позиции, т.к. #position приватное свойство
            }
        );
    }
}

class Player extends Unit {
    constructor(position, number) {
        super(position);
        this.number = number;
    }
}

class Google extends Unit {
    constructor(position) {
        super(position);
    }
}

module.exports = {
    Game
}