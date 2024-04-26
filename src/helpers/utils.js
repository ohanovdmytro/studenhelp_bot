const { google } = require("googleapis");

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
  const { ctx, senderId, user, toAll } = event;

  if (!toAll) {
    await ctx.api.sendMessage(user.userId, `<b>StudentHelp:</b>`, {
      parse_mode: "HTML",
      reply_markup: { remove_keyboard: true },
    });

    await ctx.api.copyMessage(user.userId, senderId, ctx.message.message_id);
  } else if (toAll) {
    await ctx.api.sendMessage(
      user.userId,
      `<b>StudentHelp:\n❗️ Якщо це - Ваше замовлення, внесіть замовника у таблицю!</b>`,
      {
        parse_mode: "HTML",
        reply_markup: { remove_keyboard: true },
      }
    );

    await ctx.api.copyMessage(user.userId, senderId, ctx.message.message_id);
  }

  return true;
}

function checkForSubjectKeywords(text, userSubjects) {
  const lowercasedText = text.toLowerCase();

  const foundSubject = userSubjects.find((subject) =>
    lowercasedText.includes(subject.toLowerCase())
  );

  return foundSubject !== undefined;
}

async function checkForCustomer(message) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  try {
    const spreadsheetId = process.env.SHEET_ID;
    const range = "StudentHelp, квітень 2024!B2:D";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    for (const row of rows) {
      const customer = row[2];
      const helper = row[0];

      if (
        message.toUpperCase().includes(customer) ||
        message.toUpperCase().includes(`${customer}.`)
      ) {
        return {
          customer: customer,
          helperName: helper,
        };
      }
    }

    return {
      customer: false,
      helperName: false,
    };
  } catch (error) {
    console.error("The API returned an error:", error);
    throw error;
  }
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
  checkForCustomer,
};
