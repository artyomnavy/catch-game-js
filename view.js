export class GameComponent {
    #tableElement;
    #resultsElement;
    #game;

    constructor(game) {
        this.#game = game;

        // Находим элементы table и div по id
        this.#tableElement = document.getElementById("game-grid");
        this.#resultsElement = document.getElementById("results");

        this.#game.eventEmitter.on('change', () => {
            this.render();
        })
    }

    render() {
        // Зачистка сетки игры
        this.#tableElement.innerHTML = '';

        // Зачитска счета игры
        this.#resultsElement.innerHTML = '';

        // Добавление счета игры
        this.#resultsElement.append(`Player 1: ${this.#game.score[1].points}; Player 2: ${this.#game.score[2].points}`)

        for (let y = 0; y < this.#game.settings.gridSize.rowsCount; y++) {
            // Создаем строку (элемент tr)
            const trElement = document.createElement("tr");

            for (let x = 0; x < this.#game.settings.gridSize.columnsCount; x++) {
                // Создаем столбец (элемент td) для каждой строки
                const tdElement = document.createElement("td");

                // Добавление картинки 1-го игрока в ячейку игры
                if (this.#game.players[0].position.x === x && this.#game.players[0].position.y === y) {
                    const imgElement = document.createElement("img");
                    imgElement.src = './assets/images/player1.png';

                    tdElement.append(imgElement);
                }

                // Добавление картинки 2-го игрока в ячейку игры
                if (this.#game.players[1].position.x === x && this.#game.players[1].position.y === y) {
                    const imgElement = document.createElement("img");
                    imgElement.src = './assets/images/player2.png';

                    tdElement.append(imgElement);
                }

                // Добавление картинки гугла в ячейку игры
                if (this.#game.google.position.x === x && this.#game.google.position.y === y) {
                    const imgElement = document.createElement("img");
                    imgElement.src = './assets/images/google.png';

                    tdElement.append(imgElement);
                }

                // Добавляем в tr элемент td
                trElement.append(tdElement);
            }

            // Добавляем в table элемент tr
            this.#tableElement.append(trElement);
        }
    }
}