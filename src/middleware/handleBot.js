const {
  getRegisteredUsers,
  studhelpSender,
  checkForSubjectKeywords,
  checkForCustomer,
} = require("../helpers/utils");

async function handleBot(ctx) {
  const senderId = ctx.from.id;
  const messageText = ctx.message.text;
  const registeredUsers = getRegisteredUsers();

  try {
    const res = await checkForCustomer(messageText);
    const customer = res.customer;
    const helperName = res.helperName;

    registeredUsers.map(async (user) => {
      /* Check message for filters */
      const filters = await checkForSubjectKeywords(messageText, user.subjects);

      /* Send private messages for specific executor */
      if (customer && helperName === user.name) {
        await studhelpSender({
          ctx,
          senderId,
          user,
          toAll: false,
        });

        /* Logger */
        console.log(
          `${new Date()} -- Private message sent to ${
            user.name
          }:  ${messageText}`
        );

        /* Send message if customer is not filled */
      } else if (messageText.includes("Нове замовлення:")) {
        /* Send message to fitered helpers */
        if (filters) {
          await studhelpSender({
            ctx,
            senderId,
            user,
            toAll: false,
          });

          /* Logger */
          console.log(
            `${new Date()} -- Send filtered message to helpers: ${messageText}`
          );
        }
      } else if (!customer && !helperName) {
        /* Private message sent to all users */
        if (!(senderId === user.userId)) {
          await studhelpSender({
            ctx,
            senderId,
            user,
            toAll: true,
          });

          /* Logger */
          console.log(
            `${new Date()} -- Private message sent to all users: ${messageText}`
          );
        }
      }
    });
  } catch (error) {
    console.error("Error sending StudentHelp message: ", error);
  }
}

module.exports = {
  handleBot,
};
