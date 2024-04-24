const {
  loadRegisteredUsers,
  loadPendingUsers,

  savePendingUser,
  isRegistered,
} = require("../helpers/utils");
require("dotenv").config();
const { Keyboard } = require("grammy");

const adminId = process.env.ADMIN_ID;

const webAppKeyboard = new Keyboard()
  .webApp("Обрати предмети", "https://main--studenhelpwebapp.netlify.app/")
  .resized();

async function handleAllow(ctx) {
  try {
    const senderId = ctx.message.from?.id;
    const pendingUsers = loadPendingUsers();
    const registeredUsers = loadRegisteredUsers();

    /* Get pendingsUserId and new name from command */
    const [stringUserId, pendingUserName] = ctx.match.split(",");
    const pendingUserId = Number(stringUserId);

    /* Check for admin */
    if (senderId === Number(adminId)) {
      /* Check if user is already registered */
      if (isRegistered(registeredUsers, pendingUserId)) {
        await ctx.reply("Користувач вже зареєстрований!");
        return;
      }

      /* Get pendingUser object */
      const pendingUserObject = pendingUsers.find(
        (user) => user.userId === pendingUserId
      );

      /* Push user to registered users */
      registeredUsers.push({
        userId: pendingUserId,
        username: pendingUserObject.username,
        name: pendingUserName,
        subjects: [],
      });

      savePendingUser(registeredUsers);

      /* Send user WebApp for filters */
      await ctx.api.sendMessage(
        pendingUserId,
        `Ви зареєстровані у боті, Ваше ім'я: ${pendingUserName}\n\nТепер потрібно обрати предмети, які Ви розвʼязуєте і про які Вам будуть надходити повідомлення. Для цього потрібно натиснути на кнопку, відкрити форму і поставити галочку перед предметом. У подальшому Вам будуть приходити повідомлення від бота з посиланням на замовлення з саме Ваших предметів`,
        { reply_markup: webAppKeyboard }
      );

      await ctx.reply(`Користувач ${pendingUserName} доданий`);

      /* Logger */
      console.log(
        `${new Date()} -- User ${pendingUserId} is registered by Admin`
      );
    }
  } catch (error) {
    console.error("Error allowing user: ", error.message);
  }
}

module.exports = {
  handleAllow,
};
