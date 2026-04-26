const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

const token = process.env.BOT_TOKEN;
const ADMIN_ID = 8007670371;

const bot = new TelegramBot(token, { polling: true });

const DB_FILE = "./db.json";

// ========================
// DB INIT
// ========================
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ chust: [] }, null, 2));
}

function db() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ========================
// START
// ========================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  if (chatId === ADMIN_ID) {
    bot.sendMessage(chatId, "👑 ULTRA ADMIN PANEL", {
      reply_markup: {
        keyboard: [
          ["➕ Add Chust", "📋 List Chust"],
          ["🎲 Random", "📊 Stats"],
          ["🧠 PUBG Lookup"]
        ],
        resize_keyboard: true
      }
    });
  } else {
    bot.sendMessage(chatId, "👋 Welcome to ULTRA CHUST BOT\n\n/random - chust olish");
  }
});

// ========================
// ADD CHUST (ADMIN)
// ========================
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (chatId !== ADMIN_ID) return;

  if (text === "➕ Add Chust") {
    bot.sendMessage(chatId, "✍️ Chust yozing:");

    bot.once("message", (m) => {
      if (m.chat.id !== ADMIN_ID) return;

      const data = db();
      data.chust.push(m.text);
      save(data);

      bot.sendMessage(chatId, "✅ Qo‘shildi: " + m.text);
    });
  }
});

// ========================
// RANDOM CHUST
// ========================
bot.onText(/\/random|🎲 Random/, (msg) => {
  const data = db().chust;

  if (data.length === 0) {
    return bot.sendMessage(msg.chat.id, "❌ Chust yo‘q");
  }

  const random = data[Math.floor(Math.random() * data.length)];
  bot.sendMessage(msg.chat.id, "🔥 " + random);
});

// ========================
// LIST
// ========================
bot.onText(/📋 List Chust/, (msg) => {
  const data = db().chust;

  if (data.length === 0) {
    return bot.sendMessage(msg.chat.id, "❌ Bo‘sh");
  }

  bot.sendMessage(
    msg.chat.id,
    "📋 CHUST LIST:\n\n" +
      data.map((c, i) => `${i + 1}. ${c}`).join("\n")
  );
});

// ========================
// STATS
// ========================
bot.onText(/📊 Stats/, (msg) => {
  const data = db().chust.length;
  bot.sendMessage(msg.chat.id, `📊 Jami chust: ${data}`);
});

// ========================
// PUBG ID SYSTEM (MOCK)
// ========================
bot.onText(/🧠 PUBG Lookup/, (msg) => {
  bot.sendMessage(msg.chat.id, "🆔 PUBG ID yoz:");

  bot.once("message", (m) => {
    const id = m.text;

    // fake logic (keyin API qo‘shiladi)
    const nickname = "Player_" + id.slice(-4);

    bot.sendMessage(m.chat.id, `🎮 Nickname: ${nickname}`);
  });
});

// ========================
console.log("🚀 ULTRA CHUST BOT RUNNING...");