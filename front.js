import {Game} from "./game.js";
import {EventEmitter} from "./utils/observer/event-emitter.js";
import {GameComponent} from "./view.js";

const start = async () => {
    const eventEmitter = new EventEmitter();

    const game = new Game(eventEmitter); // di

    await game.start();

    const view = new GameComponent(game) // di

    view.render();

    const handlers = {
        // Для 1-го игрока стрелки
        'ArrowUp': () => game.movePlayer1Up(),
        'ArrowDown': () => game.movePlayer1Down(),
        'ArrowLeft': () => game.movePlayer1Left(),
        'ArrowRight': () => game.movePlayer1Right(),

        // Для 2-го игрока WASD
        'KeyW': () => game.movePlayer2Up(),
        'KeyS': () => game.movePlayer2Down(),
        'KeyA': () => game.movePlayer2Left(),
        'KeyD': () => game.movePlayer2Right(),
    }

    // Перемещение игроков после нажатия кнопок
    let bindPlayersControls = (e) => {
        const handler = handlers[e.code];

        if (handler) {
            handler();
        }
    }

    window.addEventListener('keydown', bindPlayersControls);

    // // Перемещение игроков после нажатия кнопок
    // window.addEventListener('keydown', e => {
    //     switch (e.code) {
    //         // Для 1-го игрока стрелки
    //         case 'ArrowUp':
    //             game.movePlayer1Up();
    //             break;
    //         case 'ArrowDown':
    //             game.movePlayer1Down();
    //             break;
    //         case 'ArrowLeft':
    //             game.movePlayer1Left();
    //             break;
    //         case 'ArrowRight':
    //             game.movePlayer1Right();
    //             break;
    //         // Для 2-го игрока WASD
    //         case 'KeyW':
    //             game.movePlayer2Up();
    //             break;
    //         case 'KeyS':
    //             game.movePlayer2Down();
    //             break;
    //         case 'KeyA':
    //             game.movePlayer2Left();
    //             break;
    //         case 'KeyD':
    //             game.movePlayer2Right();
    //             break;
    //     }
    // })
}

start();