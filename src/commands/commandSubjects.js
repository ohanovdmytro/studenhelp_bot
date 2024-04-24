const {
  getRegisteredUsers,
  getSubjectsFromSheet,
  savePendingUser,
} = require("../helpers/utils");

const adminId = process.env.ADMIN_ID;

async function commandSubjects(ctx) {
  const senderId = ctx.message.from?.id;
  const userToModify = ctx.match;
  try {
    const registeredUsers = await getRegisteredUsers();

    if (senderId === Number(adminId)) {
      const subjects = await getSubjectsFromSheet(userToModify);

      const index = registeredUsers.findIndex(
        (user) => user.name === userToModify
      );

      if (index !== -1) {
        const registeredUserObject = registeredUsers[index];

        /* Update user's subjects */
        registeredUserObject.subjects = subjects;

        /* Save the modified user data */
        await savePendingUser(registeredUsers);

        /* Inform the user */
        await ctx.api.sendMessage(
          registeredUserObject.userId,
          `Фільтри додані, тепер Ви отримуватимете повідомлення по своїм предметам.`,
          { reply_markup: { remove_keyboard: true } }
        );

        await ctx.reply(`Користувач ${userToModify} доданий`);

        /* Logger */
        console.log(
          `${new Date()} -- User ${userToModify} received subjects by Admin`
        );
      } else {
        console.log(`User ${userToModify} not found.`);
      }
    }
  } catch (error) {
    console.error("Error adding subjects: ", error);
  }
}

module.exports = {
  commandSubjects,
};
