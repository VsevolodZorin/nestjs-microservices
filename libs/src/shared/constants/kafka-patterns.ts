export const kafkaPatterns = {
  messages: {
    auth: {
      SIGN_UP: "SIGN_UP",
      SIGN_IN: "SIGN_IN",
      SIGN_OUT: "SIGN_OUT",
      VALIDATE_USER: "VALIDATE_USER",
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
