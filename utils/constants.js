const PORT = 8080;
const CLIENT = {
  MESSAGE: {
    NEW_USER: "NEW_USER",
    NEW_MESSAGE: "NEW_MESSAGE",
    USER_DISCONNECTED: "USER_DISCONNECTED",
  },
};

const SERVER = {
  MESSAGE: {},
  BROADCAST: {
    NEW_USER: "NEW_USER",
  },
};

const getTimeNow = () => {
  const NOW = new Date();
  const HOURS = NOW.getHours().toString().padStart(2, "0");
  const MINUTES = NOW.getMinutes().toString().padStart(2, "0");

  const CURRENT_TIME = `${HOURS}:${MINUTES}`;

  return CURRENT_TIME;
};

// This check allows the module to be used in the client and the server
if (typeof module !== "undefined" && module.exports) {
  module.exports = exports = {
    PORT,
    CLIENT,
    SERVER,
    getTimeNow,
  };
}
