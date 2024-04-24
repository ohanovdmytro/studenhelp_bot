const { isRegistered, isPending } = require("./isFunctions.js");

const {
  getRegisteredUsers,
  getPendingUsers,
  getSubjectsFromSheet,
} = require("./getFunctions.js");

const { savePendingUser, saveNewUser } = require("./saveFunctions.js");

function senderName(registeredUsers, senderId) {
  const user = registeredUsers.find((user) => user.userId === senderId);
  return user ? user.name : "Unknown";
}

async function studhelpSender(event) {
  const { ctx, senderId, user } = event;

  await ctx.api.sendMessage(user.userId, `<b>StudentHelp:</b>`, {
    parse_mode: "HTML",
    reply_markup: { remove_keyboard: true },
  });

  await ctx.api.copyMessage(user.userId, senderId, ctx.message.message_id);

  return true;
}

function checkForSubjectKeywords(text, userSubjects) {
  const lowercasedText = text.toLowerCase();

  const foundSubject = userSubjects.find((subject) =>
    lowercasedText.includes(subject.toLowerCase())
  );

  return foundSubject !== undefined;
}

module.exports = {
  getRegisteredUsers,
  getPendingUsers,
  getSubjectsFromSheet,

  savePendingUser,
  saveNewUser,

  isRegistered,
  isPending,

  studhelpSender,
  senderName,
  checkForSubjectKeywords,
};
