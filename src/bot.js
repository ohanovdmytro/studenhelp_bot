const { Bot } = require("grammy");
require("dotenv").config();

const { commandAllow } = require("./commands/commandAllow");
const { commandStart } = require("./commands/commandStart");
const { commandSubjects } = require("./commands/commandSubjects");

const { handleBot } = require("./middleware/handleBot");

const { handleText } = require("./middleware/handleText");
const { handlePhoto } = require("./middleware/handlePhoto");

const { handleWebAppData } = require("./middleware/handleWebAppData");

const { handleError } = require("./helpers/handleError");

const studentHelpChatId = process.env.STUDENHELP_CHAT_ID;

const bot = new Bot(process.env.STUDENHELP_BOT_TOKEN);

/* Handle /start */
bot.command("start", commandStart);

/* Handle /allow userId,Name command */
bot.command("allow", commandAllow);

/* Handle /subjects userId command */
bot.command("subjects", commandSubjects);

/* Handle another bot updated */
bot
  .on("message")
  .filter(
    (ctx) =>
      ctx.msg.forward_origin?.sender_user?.id === Number(studentHelpChatId),
    handleBot
  );

/* Handle sent messages */
bot.on("message:text", handleText);

/* Handle sent photo */
bot.on("message:photo", handlePhoto);

/* Handle web app data */
bot.on(":web_app_data", handleWebAppData);

/* Handle errors */
bot.catch(handleError);

bot.start();
