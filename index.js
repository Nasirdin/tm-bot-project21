const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();
const { readFile, writeFile, unLink } = require("fs").promises;
const cron = require("node-cron");

const channelId = "-1001540449203";

const commands = `
/start - Перезапустить бота
/help - Помощь
/mypoints - Мои баллы
`;

let textOfTheDay = 20;

const wordsForEveryDay = [
  "- Не могу дождаться, чтобы собрать тусовку в эти выходные",
  "- А если бы мы сейчас держались за руки 😏",
  "- Иногда самые совершенные вещи не имеют никакого смысла. Это нормально ",
  "- Прости, я потерялся, глядя в твои глаза",
  "- 🦈🦈 Эти ребята классные",
  "- Махаться будешь?",
  "- С тобой так хорошо, а без тебя ещё лучше 😊",
  "- Добро пожалуйста в проект самых крутых ребят",
  "- Прекрасный мир, ведь в нём есть такие красивые люди как ты и твоя дальная тётя",
  "- Ты не возражаешь? Я пытался не влюбится сегодня, не вышло",
  "- Давай посидим всю ночь и вместе встретим восход солнца. Потом будем спать до 6-вечера как убитые",
  "- Давай состаримся вместе",
  "- Я хочу дать тебе лучшую версию себя",
  "- О, наша любовь? это наш маленький секрет",
  "- Не всё начинается с понедельника! Кроме учёбы",
  "- Вы можете мне помочь? У меня сломался телефон и в нем нет вашего номера",
  "- У вас очень много красивых изгибов, но улыбка лучший из них",
  "- Здесь жарко или вы горячий, словно огонь?",
  "- Ёлки палки, проснись уже",
  "- Ну и как спалось сегодня? 🙃",
  "- Чё, проспал как и я?",
];

const rFile = () => {
  return readFile(`${__dirname}/user.json`, { encoding: "utf8" }).then((text) => JSON.parse(text));
};

const wFile = (users) => {
  writeFile(`${__dirname}/user.json`, JSON.stringify(users), { encoding: "utf8" });
  return false;
};

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  ctx.reply(`Привет🖐 ${ctx.message.from.first_name} \n\n\
Я чат-бот PROJECT21 и я здесь, чтобы помочь вам провести время с \
пользой`);
  const users = await rFile();
  const username = ctx.message.from.username;
  const chatId = ctx.message.chat.id;
  const newUser = {
    chatId: chatId,
    username: username,
    bonus: 0,
  };
  if (!users[0]) {
    const newUsers = [{ userId: 1, ...newUser }];
    wFile(newUsers);
  } else {
    let findUser = false;
    users.filter((element) => {
      if (element.username === username) {
        findUser = true;
      }
    });
    if (!findUser) {
      const newArr = users.map((el) => {
        return el.userId;
      });
      userId = Math.max(...newArr) + 1;

      const newUsers = [...users, { userId, ...newUser }];
      wFile(newUsers);
    }
  }
});

bot.command("mypoints", async (ctx) => {
  try {
    const users = await rFile();
    const point = await users.filter((user) => {
      return user.username === ctx.from.username;
    });
    ctx.replyWithHTML(`Вы набрали ${point[0].bonus} баллов`);
  } catch (error) {
    console.log;
  }
});
bot.help((ctx) => ctx.reply(`Вот, чем я могу помочь:\n ${commands}`));

bot.on("video", async (ctx) => {
  try {
    await ctx.replyWithHTML(
      "Это отчёт за...",
      Markup.inlineKeyboard([
        [Markup.button.callback("- Тренировку ", "training")],
        [Markup.button.callback("- Рацион питания", "food")],
        [Markup.button.callback("- Подъём в 06:00", "clock")],
      ])
    );
    ctx.telegram.forwardMessage(channelId, ctx.message.chat.id, ctx.message.message_id);
  } catch (error) {
    console.error(error);
  }
});

bot.action(`${"training" || "food" || "clock"}`, async (ctx) => {
  try {
    await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    await ctx.replyWithHTML("✅ Отчёт принят! + балл");
    const users = await rFile();
    const addBonus = users.map((element) => {
      if (element.username === ctx.from.username) {
        const newBonus = {
          userId: element.userId,
          chatId: element.chatId,
          username: element.username,
          bonus: element.bonus + 1,
        };
        return newBonus;
      } else {
        return element;
      }
    });
    wFile(addBonus);
  } catch (error) {
    console.error(error);
  }
});

cron.schedule("00 6 * * *", async () => {
  const users = await rFile();
  users.map((user) => {
    textOfTheDay == 21 ? 0 : (textOfTheDay = +1);
    bot.telegram.sendMessage(user.chatId, wordsForEveryDay[textOfTheDay]);
  });
  console.log(textOfTheDay);
});

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
