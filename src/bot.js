const { Bot, HttpError, GrammyError } = require("grammy");
require("dotenv").config();

const { commandAllow } = require("./commands/commandAllow");
const { commandStart } = require("./commands/commandStart");
const { commandSubjects } = require("./commands/commandSubjects");

const { handleText } = require("./middleware/handleText");
const { handlePhoto } = require("./middleware/handlePhoto");

const { handleWebAppData } = require("./middleware/handleWebAppData");

const { handleError } = require("./helpers/handleError");

const bot = new Bot(process.env.STUDENHELP_TEST_BOT_TOKEN);

/* Handle /start */
bot.command("start", commandStart);

/* Handle /allow userId,Name command */
bot.command("allow", commandAllow);

/* Handle /subjects userId command */
// bot.command("subjects", commandSubjects);

/* Handle sent messages */
bot.on("message:text", handleText);

/* Handle sent photo */
bot.on("message:photo", handlePhoto);

/* Handle web app data */
bot.on(":web_app_data", handleWebAppData);

/* Handle errors */
bot.catch(handleError);

bot.start();
