const {
  loadRegisteredUsers,
  senderName,
  isRegistered,
  saveRegisteredUsers,
} = require("../helpers/utils");

async function handleStart(ctx) {
  try {
    const newUserId = ctx.message.from.id;
    const newUsername = ctx.message.from.username;
    const newFirstName = ctx.message.from.first_name;
    const registeredUsers = loadRegisteredUsers();

    /* Check if user is registered, otherwise - register */
    if (!isRegistered(registeredUsers, newUserId)) {
      registeredUsers.push({
        userId: newUserId,
        username: newUsername,
        name: newFirstName,
      });
      saveRegisteredUsers(registeredUsers);

      const yourNameHeader = senderName(registeredUsers, newUserId);
      await ctx.reply(`Ви зареєстровані, Ваше ім'я: ${yourNameHeader}`);

      /* Logger */
      console.log(`${new Date()} -- User ${newUserId} is registered`);
    } else {
      await ctx.reply("Ви вже зареєстровані.");
    }
  } catch (error) {
    console.error("Error registering: ", error.message);
    await ctx.reply("Error occurred when registering.");
  }
}

module.exports = {
  handleStart,
};
