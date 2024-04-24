const {
  getRegisteredUsers,
  getPendingUsers,
  getSubjectsFromSheet,
  savePendingUser,
} = require("../helpers/utils");

async function handleWebAppData(ctx) {
  const registeredUsers = getRegisteredUsers();
  const userId = ctx.message.from?.id;

  const webAppData = JSON.parse(ctx.msg.web_app_data.data);
  console.log(webAppData.filledSubjects);

  /* Check if subjects was written to DB in web app */
  if (webAppData.filledSubjects) {
    try {
      const user = registeredUsers.find((user) => user.userId === userId);

      /* Get subjects for user in Sheet */
      const subjects = await getSubjectsFromSheet(user.name);

      /* Save user subjects */
      if (user) {
        user.subjects = subjects;
        savePendingUser(registeredUsers);
      }

      await ctx.reply(
        `Дякую! Ваші предмети збережені, тепер Вам надходитимуть замовлення лише з вказаних предметів.`,
        { reply_markup: { remove_keyboard: true } }
      );

      /* Logger */
      console.log(`${new Date()} -- Subjects saved for ${userId}`);
    } catch (error) {
      console.error("Error sending message: ", error.message);
    }
  }
}

module.exports = {
  handleWebAppData,
};
