const { Bot, HttpError, GrammyError } = require("grammy");
require("dotenv").config();

const { handleStart } = require("./commands/commandStart");

const { handleText } = require("./middleware/handleText");
const { handlePhoto } = require("./middleware/handlePhoto");

const { handleError } = require("./helpers/handleError");

const bot = new Bot(process.env.STUDENHELP_TEST_BOT_TOKEN);

/* Handle /start */
bot.command("start", handleStart);

/* Handle sent messages */
bot.on("message:text", handleText);

/* Handle sent photo */
bot.on("message:photo", handlePhoto);

/* Handle errors */
bot.catch(handleError);

bot.start();
