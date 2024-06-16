class Game {
    #settings = {
        // Размер сетки игры
        gridSize: {
            columnsCount: 4,
            rowsCount: 4
        }
    };
    // Статутс игры (pending, in-progress, paused, finished)
    #status = 'pending';
    #player1;
    #player2;
    #google;

    constructor() {
    }

    #getRandomPosition(notCrossedPositions = []) {
        let newX;
        let newY;

        do {
            // Генерируем случайные координаты
            newX = NumberUtil.getRandomNumber(0, this.#settings.gridSize.columnsCount - 1);
            newY = NumberUtil.getRandomNumber(0, this.#settings.gridSize.rowsCount - 1);
        }
            // Генерируем координаты пока они равны хотя бы одной позиции массиваы notCrossedPositions
        while (
            notCrossedPositions.some(p => newX === p.x && newY === p.y)
            );

        return new Position(newX, newY);
    }

    get settings() {
        return this.#settings;
    }

    set settings(settings) {
        if (!settings.gridSize) {
            throw new Error('Game gridSize is missing');
        }

        if (settings.gridSize.columnsCount * settings.gridSize.rowsCount < 3) {
            throw new Error('Cells count should be 3 and more. Increase columnsCount or rowsCount');
        }

        this.#settings = settings;
    }

    get status() {
        return this.#status
    }

    #createPlayers() {
        const player1Position = new Position(
            NumberUtil.getRandomNumber(0, this.#settings.gridSize.columnsCount - 1),
            NumberUtil.getRandomNumber(0, this.#settings.gridSize.rowsCount - 1)
        )
        this.#player1 = new Player(player1Position);

        const player2Position = this.#getRandomPosition([player1Position]);
        this.#player2 = new Player(player2Position);

        const googlePosition = this.#getRandomPosition([player1Position, player2Position])
        this.#google = new Google(googlePosition);
    }

    async start() {
        if (this.#status === 'pending') {
            this.#createPlayers();
            this.#status = 'in-progress';
        }
    }

    get players() {
        return [this.#player1, this.#player2];
    }

    get google() {
        return this.#google;
    }
}

class NumberUtil {
    // вернет случайное число от мин до макс включительно
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Unit  {
    constructor(position) {
        this.position = position;
    }
}

class Player extends Unit {
    constructor(position) {
        super(position);
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

