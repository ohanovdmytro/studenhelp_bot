const fs = require("fs");
const { google } = require("googleapis");

function isRegistered(registeredUsers, senderId) {
  return registeredUsers.some((user) => user.userId === senderId);
}
function isPending(pendingUsers, senderId) {
  return pendingUsers.some((user) => user.userId === senderId);
}

function senderName(registeredUsers, senderId) {
  const user = registeredUsers.find((user) => user.userId === senderId);
  return user ? user.name : "Unknown";
}

function getRegisteredUsers() {
  try {
    const data = fs.readFileSync("./storage/registered_users.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading registered users:", error.message);
    return [];
  }
}

function getPendingUsers() {
  try {
    const data = fs.readFileSync("./storage/pending_users.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading pending users:", error.message);
    return [];
  }
}

function saveNewUser(newUsers) {
  try {
    fs.writeFileSync(
      "./storage/pending_users.json",
      JSON.stringify(newUsers, null, 2)
    );
  } catch (error) {
    console.error("Error saving pending users:", error.message);
  }
}

function savePendingUser(pendingUsers) {
  try {
    fs.writeFileSync(
      "./storage/registered_users.json",
      JSON.stringify(pendingUsers, null, 2)
    );
  } catch (error) {
    console.error("Error saving pending users:", error.message);
  }
}

async function getSubjectsFromSheet(name) {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  const SPREADSHEET_ID = process.env.SHEET_ID;
  const SHEET_NAME = "Предмети";

  const range = `${SHEET_NAME}!A1:ZZ1`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });

  const headerRow = response.data.values[0];
  const targetColumnIndex = headerRow
    .map((userName, index) => (userName === name ? index : -1))
    .filter((index) => index !== -1)[0];

  const columnValuesResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!${String.fromCharCode(
      65 + targetColumnIndex
    )}2:${String.fromCharCode(65 + targetColumnIndex)}`, // Starting from row 2
  });

  const columnValues = columnValuesResponse.data.values.map((row) => row[0]);

  return columnValues;
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

module.exports = {
  getRegisteredUsers,
  getPendingUsers,

  savePendingUser,
  saveNewUser,

  senderName,

  isRegistered,
  isPending,

  studhelpSender,
  getSubjectsFromSheet,
};
