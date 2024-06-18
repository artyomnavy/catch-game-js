// Для запуска тестов с ECMAScript modules (ESM) необходимо прописать в терминале:
// yarn node --experimental-vm-modules node_modules/jest/bin/jest.js
// или использовать скрипт test из package.json

export default {
    testEnvironment: 'jest-environment-node', // тесты выполняются в node окружении
    transform: {}, // чтобы jest не преобразовывал модули ECMAScript (т.к. они уже используются)
    testRegex: '.test.js$'
}