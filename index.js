const { Telegraf, Markup } = require("telegraf");
const cron = require("node-cron");
const channelId = "-1001540449203";
require("dotenv").config();
const { readFile, writeFile, unLink } = require("fs").promises;

let userArray = [
  {
    userId: 2,
    chatId: 979996413,
    username: "danbazarbekov",
    bonus: 0,
    timeOutTraining: true,
    timeOutFood: true,
    timeOutClock: true,
  },
];
const commands = `
/start - Перезапустить бота
/help - Помощь
/mypoints - Мои баллы
/allreports - Данные участников
/delete - Удалить участника
/deleteofthelist - Удалить участника из списка
/add - Добавить участника в список

`;

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
const rNFile = () => {
  return readFile(`${__dirname}/newUsers.json`, { encoding: "utf8" }).then((text) => JSON.parse(text));
};

const wNFile = (users) => {
  writeFile(`${__dirname}/newUsers.json`, JSON.stringify(users), { encoding: "utf8" });
  return false;
};

const help = `У вас есть доступ только к этим командам - 
/start - Перезапустить бота
/help - Помощь
/mypoints - Мои баллы
`;

const bot = new Telegraf(process.env.BOT_TOKEN);

const checkUser = async (ok, ctx) => {
  const users = await rNFile();
  const findUser = users.filter((user) => {
    return ctx.from.username === user.username;
  });
  if (!findUser[0]) {
    ctx.reply("Чтобы стать участников проекта #PROJECT21 обращайтесь к @danbazarbekov");
    return false;
  } else {
    return true;
  }
};

bot.start(async (ctx) => {
  try {
    let ok = false;
    const findUser = await checkUser(ok, ctx);
    if (findUser) {
      ctx.reply(`Я чат-бот #PROJECT21: и я твой персональный помощник на следующие 21-дней`);
      const users = await rFile();
      const username = ctx.message.from.username;
      const chatId = ctx.message.chat.id;
      const newUser = {
        chatId: chatId,
        username: username,
        bonus: 0,
        timeOutTraining: true,
        timeOutFood: true,
        timeOutClock: true,
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
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
});
bot.command("allreports", async (ctx) => {
  try {
    if (ctx.from.username === "danbazarbekov" || ctx.from.username === "Nasirdin1") {
      const users = await rFile();
      const a = users.map((e) => {
        return `@${e.username} - ${e.bonus} балл`;
      });
      ctx.reply(`Данные участников
  
${a.join("                                                                                ")}`);
    } else {
      ctx.reply(`Жаль(, что вы не Дастан )

${help}`);
    }
  } catch (error) {
    console.error(error);
  }
});

bot.command("add", async (ctx) => {
  try {
    if (ctx.from.username === "danbazarbekov" || ctx.from.username === "Nasirdin1") {
      const message = ctx.message.text.split(" ");
      if (message.length <= 1) {
        ctx.reply(`Проверьте правильность написания.
Пример: /add danbazarbekov`);
        return false;
      }
      const users = await rNFile();
      if (!users[0]) {
        const newUsers = [{ userId: "1" * 1, username: message[1] }];
        wNFile(newUsers);
        ctx.reply("Пользователь успешно добавлен!");
      } else {
        let findUser = false;
        users.filter((element) => {
          if (element.username === message[1]) {
            findUser = true;
          }
        });
        if (!findUser) {
          const newArr = users.map((el) => {
            return el.userId;
          });
          userId = Math.max(...newArr) + 1;

          const newUsers = [...users, { userId, username: message[1] }];
          wNFile(newUsers);
          ctx.reply("Пользователь успешно добавлен!");
        } else {
          ctx.reply("Ползователь уже добавлен!");
        }
      }
    } else {
      ctx.reply(`Дастан это ты? 🤨
  
${help}`);
    }
  } catch (error) {
    console.error(error);
  }
});

bot.command("delete", async (ctx) => {
  try {
    if (ctx.from.username === "danbazarbekov" || ctx.from.username === "Nasirdin1") {
      const message = ctx.message.text.split(" ");
      const users = await rFile();
      const deleteUser = users.filter((user) => {
        return `${user.username}` !== message[1];
      });
      if (message.length == 1) {
        ctx.reply(`Ауу где половина? )
Пример: /delete ${ctx.from.username}`);
        return false;
      }
      if (users.length === deleteUser.length) {
        ctx.reply(`Пользователь не найден!
Проверьте правильность написания.
Пример: /delete ${ctx.from.username}`);
      } else {
        wFile(deleteUser);
        ctx.reply(`Пользователь @${message[1]} успешно удален`);
      }
    } else {
      ctx.reply(`Хмм! Где Дастан? 😠
      
${help}`);
    }
  } catch (error) {
    console.error(error);
  }
});

bot.command("deleteofthelist", async (ctx) => {
  try {
    if (ctx.from.username === "danbazarbekov" || ctx.from.username === "Nasirdin1") {
      const message = ctx.message.text.split(" ");
      const users = await rNFile();
      const deleteUser = users.filter((user) => {
        return `${user.username}` !== message[1];
      });
      if (message.length == 1) {
        ctx.reply(`Ауу где половина? )
Пример: /deleteofthelist ${ctx.from.username}`);
        return false;
      }
      if (users.length === deleteUser.length) {
        ctx.reply(`Пользователь не найден!
Проверьте правильность написания.
Пример: /delete ${ctx.from.username}`);
      } else {
        wNFile(deleteUser);
        ctx.reply(`Пользователь @${message[1]} успешно удален`);
      }
    } else {
      ctx.reply(`Вы кто? да да Вы!

${help}`);
    }
  } catch (error) {
    console.error(error);
  }
});

bot.command("mypoints", async (ctx) => {
  console.log(userArray);

  try {
    let ok = false;

    const findUser = await checkUser(ok, ctx);
    if (findUser) {
      const users = await rFile();
      const point = await users.filter((user) => {
        return user.username === ctx.from.username;
      });
      ctx.replyWithHTML(`Вы набрали ${point[0].bonus} баллов`);
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
});

bot.help((ctx) => ctx.reply(`Вот, чем я могу помочь:\n ${commands}`));

bot.on("video_note", async (ctx) => {
  try {
    let ok = false;
    const findUser = await checkUser(ok, ctx);
    if (findUser) {
      await ctx.replyWithHTML(
        "Это отчёт за...",
        Markup.inlineKeyboard([
          [Markup.button.callback("- Тренировку ", "training")],
          [Markup.button.callback("- Рацион питания", "food")],
          [Markup.button.callback("- Подъём в 06:00", "clock")],
        ])
      );
      ctx.telegram.forwardMessage(channelId, ctx.message.chat.id, ctx.message.message_id);
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
});
bot.on("video", async (ctx) => {
  try {
    let ok = false;
    const findUser = await checkUser(ok, ctx);
    if (findUser) {
      await ctx.replyWithHTML(
        "Это отчёт за...",
        Markup.inlineKeyboard([
          [Markup.button.callback("- Тренировку ", "training")],
          [Markup.button.callback("- Рацион питания", "food")],
          [Markup.button.callback("- Подъём в 06:00", "clock")],
        ])
      );
      ctx.telegram.forwardMessage(channelId, ctx.message.chat.id, ctx.message.message_id);
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
});

const timeOut = (ctx, users) => {
  const timeOut = users.map((element) => {
    if (element.username === ctx.from.username) {
      const newBonus = {
        userId: element.userId,
        chatId: element.chatId,
        username: element.username,
        bonus: element.bonus + 1,
        timeOutTraining: true,
        timeOutFood: true,
        timeOutClock: true,
      };
      return newBonus;
    } else {
      return element;
    }
  });
  wFile(timeOut);
};
const report = async (users, ctx, type) => {
  try {
    await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
    await ctx.replyWithHTML("✅ Отчёт принят! + балл");
    const addBonus = users.map((element) => {
      if (element.username === ctx.from.username) {
        const newBonus = {
          userId: element.userId,
          chatId: element.chatId,
          username: element.username,
          bonus: element.bonus + 1,
          timeOutTraining: type == "training" ? false : element.timeOutTraining,
          timeOutFood: type == "food" ? false : element.timeOutFood,
          timeOutClock: type == "clock" ? false : element.timeOutClock,
        };
        return newBonus;
      } else {
        return element;
      }
    });
    wFile(addBonus);
    cron.schedule("0 5 * * *", async () => {
      timeOut(ctx, users, type);
    });
  } catch (error) {
    console.error(error);
  }
};

bot.action(`training`, async (ctx) => {
  const users = await rFile();
  const userArray = users.filter((e) => {
    return e.username === ctx.from.username;
  });

  if (!userArray[0].timeOutTraining) {
    await ctx.replyWithHTML("Вы уже отправили отчет о тренировке!");
  } else {
    let type = ctx.update.callback_query.data;
    report(users, ctx, type);
  }
});

bot.action(`food`, async (ctx) => {
  const users = await rFile();
  const userArray = users.filter((e) => {
    return e.username === ctx.from.username;
  });
  if (!userArray[0].timeOutFood) {
    await ctx.replyWithHTML("Вы уже отправили отчет!");
  } else {
    let type = ctx.update.callback_query.data;
    report(users, ctx, type);
  }
});

bot.action(`clock`, async (ctx) => {
  const users = await rFile();
  const userArray = users.filter((e) => {
    return e.username === ctx.from.username;
  });
  if (!userArray[0].timeOutClock) {
    await ctx.replyWithHTML("Вы уже отправили отчет");
  } else {
    let type = ctx.update.callback_query.data;
    report(users, ctx, type);
  }
});
let textOfTheDay = 15;

cron.schedule("*/2 * * * *", async () => {
  const users = await rFile();
  if (textOfTheDay == 21) {
    textOfTheDay = 0;
  } else {
    textOfTheDay += 1;
  }
  users.map((user) => {
    bot.telegram.sendMessage(
      user.chatId,
      !wordsForEveryDay[textOfTheDay] ? wordsForEveryDay[7] : wordsForEveryDay[textOfTheDay]
    );
  });
});

bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));


// [
//   {
//     "userId": 1,
//     "chatId": 654924716,
//     "username": "Nasirdin1",
//     "bonus": 0,
//     "timeOutTraining": true,
//     "timeOutFood": true,
//     "timeOutClock": true
//   },
//   {
//     "userId": 2,
//     "chatId": 979996413,
//     "username": "danbazarbekov",
//     "bonus": 1,
//     "timeOutTraining": true,
//     "timeOutFood": true,
//     "timeOutClock": true
//   }
// ]