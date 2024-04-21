const {
  loadRegisteredUsers,
  senderName,
  isRegistered,
} = require("../helpers/utils");

async function handleText(ctx) {
  /* Pin message */
  if (ctx.message.pinned_message) {
    try {
      const senderId = ctx.message.from.id;
      const pinnedMessage = ctx.message.pinned_message;
      const registeredUsers = loadRegisteredUsers();
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

  const senderId = ctx.message.from.id;
  const messageText = ctx.message.text;
  const forwardId = ctx.msg.forward_origin?.sender_user?.id;
  let isStudentHelp = false;

  try {
    const registeredUsers = await loadRegisteredUsers();

    /* Check if sender is registered */
    if (isRegistered(registeredUsers, senderId)) {
      const senderNameHeader = senderName(registeredUsers, senderId);

      /* Iterate through all users */
      registeredUsers.map(async (user) => {
        if (user.userId !== senderId) {
          /* Check if message is from StudentHelp */
          if (forwardId === Number(process.env.STUDENHELP_TEST_CHAT_ID)) {
            isStudentHelp = true;
            /* Sending StudentHelp header */
            await ctx.api.sendMessage(user.userId, `<b>StudentHelp:</b>`, {
              parse_mode: "HTML",
            });

            /* Forwarding message from sender to every user */
            await ctx.api.copyMessage(
              user.userId,
              senderId,
              ctx.message.message_id
            );

            return;
          }

          /* Send sender message */
          await ctx.api.sendMessage(
            user.userId,
            `<b>${senderNameHeader}</b>:\n${messageText}`,
            { parse_mode: "HTML" }
          );
        }
      });

      /* Logger */
      if (isStudentHelp) {
        console.log(
          `${new Date()} -- Got a message from StudentHelp ${messageText}`
        );
      } else {
        console.log(
          `${new Date()} -- User ${senderId} sent a new message: ${messageText}`
        );
      }
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
