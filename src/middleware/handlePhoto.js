const {
  loadRegisteredUsers,
  senderName,
  isRegistered,
} = require("../helpers/utils");

async function handlePhoto(ctx) {
  /* Pin photo */
  if (typeof ctx.message.pinned_message === "object") {
    const senderId = ctx.message.from.id;
    const pinnedMessage = ctx.message.pinned_message;
    const registeredUsers = loadRegisteredUsers();

    if (isRegistered(registeredUsers, senderId)) {
      let msgIdCounter = 0;
      registeredUsers.map(async (user) => {
        if (user.userId !== senderId) {
          // await ctx.api.pinChatMessage(
          //   user.userId,
          //   `${pinnedMessage.message_id}`
          // );
          await ctx.api.sendMessage(user.userId, `TODO: запінити фото`);
        }
      });
    }
    return;
  }

  const senderId = ctx.message.from.id;
  const photosArray = ctx.message.photo;
  const photo = photosArray.slice(-1);
  const photoId = photo[0].file_id;

  try {
    const registeredUsers = loadRegisteredUsers();

    /* Check if sender is registered */
    if (isRegistered(registeredUsers, senderId)) {
      const senderNameHeader = senderName(registeredUsers, senderId);

      /* Iterate through all users */
      registeredUsers.map(async (user) => {
        if (user.userId !== senderId) {
          /* Send senders photo */
          await ctx.api.sendPhoto(user.userId, photoId, {
            caption: `<b>${senderNameHeader}:</b>`,
            parse_mode: "HTML",
            reply_markup: { remove_keyboard: true },
          });
        }
      });

      /* Logger */
      console.log(
        `${new Date()} -- User ${user.userId} sent a photo: ${photoId}`
      );
    } else {
      ctx.reply("Ви не зареєстровані. Надішліть /start щоб зареєструватись.");
    }
  } catch (error) {
    console.error("Error sending message: ", error.message);
  }
}

module.exports = {
  handlePhoto,
};
