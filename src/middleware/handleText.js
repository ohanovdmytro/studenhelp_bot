const {
  getRegisteredUsers,
  senderName,
  isRegistered
} = require("../helpers/utils");

async function handleText(ctx) {
  /* Pin message */
  if (ctx.message.pinned_message) {
    try {
      const senderId = ctx.message.from.id;
      const pinnedMessage = ctx.message.pinned_message;
      const registeredUsers = getRegisteredUsers();
      // console.log(pinnedMessage.message_id - 2);

      // try {
      //   await ctx.api.sendMessage(senderId, `${pinnedMessage.message_id - 2}`);
      // } catch (error) {
      //   console.error(error.message);
      // }

      if (isRegistered(registeredUsers, senderId)) {
        let msgIdCounter = 0;
        registeredUsers.map(async (user) => {
          if (user.userId !== senderId) {
            // await ctx.api.pinChatMessage(
            //   user.userId,
            //   `${pinnedMessage.message_id}`
            // );
            await ctx.api.sendMessage(user.userId, `TODO: пін повідомлення`);
          }
        });
      }
      return;
    } catch (error) {
      console.error(error.message);
    }
  }

  const senderId = ctx.from.id;
  const messageText = ctx.message.text;

  try {
    const registeredUsers = await getRegisteredUsers();

    /* Check if sender is registered */
    if (isRegistered(registeredUsers, senderId)) {
      const senderNameHeader = senderName(registeredUsers, senderId);

      /* Iterate through all users */
      registeredUsers.map(async (user) => {
        if (user.userId !== senderId) {
          /* Send usual senders message */
          await ctx.api.sendMessage(
            user.userId,
            `<b>${senderNameHeader}</b>:\n${messageText}`,
            { parse_mode: "HTML", reply_markup: { remove_keyboard: true } }
          );
        }
      });

      /* Logger */
      console.log(
        `${new Date()} -- User ${senderId} sent a new message: ${messageText}`
      );
    } else {
      await ctx.reply(
        "Ви не зареєстровані. Надішліть /start щоб зареєструватись."
      );
    }
  } catch (error) {
    console.error("Error sending message: ", error.message);
  }
}

module.exports = {
  handleText,
};
