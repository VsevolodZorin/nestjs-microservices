"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kafkaPatterns = void 0;
exports.kafkaPatterns = {
    messages: {
        auth: {
            SIGN_UP: "SIGN_UP",
            SIGN_IN: "SIGN_IN",
            SIGN_OUT: "SIGN_OUT",
        },
        posts: {
            POST_CREATED: "POST_CREATED",
            POST_UPDATED: "POST_UPDATED",
            POST_DELETED: "POST_DELETED",
            POST_FIND_BY_ID: "POST_FIND_BY_ID",
            POST_FIND_ALL: "POST_FIND_ALL",
        },
    },
    events: {
        TEST_EVENT: "TEST_EVENT",
    },
};
//# sourceMappingURL=kafka-patterns.js.map