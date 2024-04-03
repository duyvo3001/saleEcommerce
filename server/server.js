"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const PORT = 8000;
const server = app_1.app.listen(PORT, () => {
    console.log('server listening on ', PORT);
});
process.on('SIGINT', () => {
    server.close(() => console.log('server closed'));
});
//# sourceMappingURL=server.js.map