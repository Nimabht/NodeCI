const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygrip = new Keygrip([keys.cookieKey]);
const Buffer = require("safe-buffer").Buffer;

module.exports = async (userModel) => {
  const sessionObject = {
    passport: {
      user: userModel._id.toString(),
    },
  };

  const session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");

  const sig = keygrip.sign("session=" + session);

  return {
    session,
    sig,
  };
};
