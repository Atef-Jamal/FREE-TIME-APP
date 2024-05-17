import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connecteToMongodb } from "./db/connectToMongodb";
import authRouter from "./routes/authRoutes";
import usersRouter from "./routes/usersRoutes";
import conversationsRoute from "./routes/privateChatRoutes";
import notificationRoute from "./routes/notificationRoutes";
import publicChatRoute from "./routes/publicChatRoutes";
import songRoute from "./routes/songRoutes";
import taskRoute from "./routes/appsRoutes";
import frameRoute from "./routes/frameRoutes";
import testimonialRoute from "./routes/testimonialRoutes";
import couponRoute from "./routes/couponRoutes";
import searchRoute from "./routes/searchRoute";
import http from "http";
import { Server } from "socket.io";
// import Task from "./models/task";
// import Task from "./models/task";
// import cron from "node-cron";
// import moment from "moment-timezone";
// import { grantRewardsToAllUsers } from "./utils";

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);

app.use(
  cors({
    origin: [process.env.CLIENT_BASE_URL!],
  })
);

export const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_BASE_URL!],
  },
});

export const onLineUsers: { [key: string]: string } = {};

app.use("/api/auth", authRouter);

app.use("/api/users", usersRouter);

app.use("/api/conversations", conversationsRoute);

app.use("/api/publicchat", publicChatRoute);

app.use("/api/notifications", notificationRoute);

app.use("/api/tasks", taskRoute);

app.use("/api/songs", songRoute);

app.use("/api/frames", frameRoute);

app.use("/api/testimonials", testimonialRoute);

app.use("/api/coupons", couponRoute);

app.use("/api/search", searchRoute);

app.use("/uploads", express.static(path.join("uploads")));

// const scheduleTime = moment
//   .tz("12:00", "HH:mm", "Africa/Cairo")
//   .tz("EET")
//   .format("m H * * *");

// cron.schedule(scheduleTime, grantRewardsToAllUsers);

// const gameNames = [
//   "The Legend of Zelda: Breath of the Wild",
//   "Super Mario Odyssey",
//   "Red Dead Redemption 2",
//   "The Witcher 3: Wild Hunt",
//   "God of War",
//   "Horizon Zero Dawn",
//   "Minecraft",
//   "Fortnite",
//   "Overwatch",
//   "Call of Duty: Modern Warfare",
//   "Cyberpunk 2077",
//   "Animal Crossing: New Horizons",
//   "Halo Infinite",
//   "Ghost of Tsushima",
//   "Apex Legends",
//   "Among Us",
//   "Valorant",
//   "Genshin Impact",
//   "League of Legends",
//   "Dota 2",
//   "FIFA 21",
//   "NBA 2K21",
//   "Madden NFL 21",
//   "Battlefield V",
//   "Assassin's Creed Valhalla",
//   "Far Cry 5",
//   "Rainbow Six Siege",
//   "Rocket League",
//   "PUBG: Battlegrounds",
//   "Grand Theft Auto V",
//   "Final Fantasy XV",
//   "Resident Evil Village",
//   "Monster Hunter: World",
//   "Sekiro: Shadows Die Twice",
//   "Dark Souls III",
//   "Bloodborne",
//   "Nioh 2",
//   "Elden Ring",
//   "Splatoon 2",
//   "Mario Kart 8 Deluxe",
//   "Super Smash Bros. Ultimate",
//   "Metroid Dread",
//   "Persona 5",
//   "Nier: Automata",
//   "Yakuza: Like a Dragon",
//   "Death Stranding",
//   "Hades",
//   "Celeste",
//   "Hollow Knight",
//   "Stardew Valley",
//   "Terraria",
//   "Cuphead",
//   "Dead Cells",
//   "Ori and the Will of the Wisps",
//   "Inside",
//   "Limbo",
//   "Gris",
//   "Journey",
//   "Firewatch",
//   "What Remains of Edith Finch",
//   "The Stanley Parable",
//   "Outer Wilds",
//   "No Man's Sky",
//   "Subnautica",
//   "The Outer Worlds",
//   "Control",
//   "Dishonored 2",
//   "Prey",
//   "Bioshock Infinite",
//   "Deus Ex: Mankind Divided",
//   "Metro Exodus",
//   "Doom Eternal",
//   "Wolfenstein II: The New Colossus",
//   "Destiny 2",
//   "Borderlands 3",
//   "Diablo III",
//   "Torchlight II",
//   "Path of Exile",
//   "Divinity: Original Sin 2",
//   "Baldur's Gate 3",
//   "Pillars of Eternity II: Deadfire",
//   "Wasteland 3",
//   "XCOM 2",
//   "Gears 5",
//   "Forza Horizon 4",
//   "Gran Turismo Sport",
//   "Need for Speed Heat",
//   "Mortal Kombat 11",
//   "Street Fighter V",
//   "Tekken 7",
//   "Soulcalibur VI",
//   "Dragon Ball FighterZ",
//   "Super Mario Maker 2",
//   "LittleBigPlanet 3",
//   "Dreams",
//   "Sackboy: A Big Adventure",
//   "Ratchet & Clank: Rift Apart",
//   "Spyro Reignited Trilogy",
//   "Crash Bandicoot N. Sane Trilogy",
//   "Crash Team Racing Nitro-Fueled",
//   "Spyro the Dragon",
//   "Final Fantasy VII Remake",
//   "Kingdom Hearts III",
//   "Dragon Quest XI",
//   "Octopath Traveler",
//   "Bravely Default II",
//   "Fire Emblem: Three Houses",
//   "Xenoblade Chronicles 2",
//   "Pokemon Sword and Shield",
//   "Pokemon Let's Go, Pikachu! and Let's Go, Eevee!",
//   "Pokemon Legends: Arceus",
//   "Digimon Story: Cyber Sleuth",
//   "Yo-kai Watch 4",
//   "Shin Megami Tensei V",
//   "Bayonetta 2",
//   "Astral Chain",
//   "Danganronpa V3: Killing Harmony",
//   "Phoenix Wright: Ace Attorney Trilogy",
//   "Professor Layton and the Curious Village",
//   "The Great Ace Attorney Chronicles",
//   "Zero Escape: The Nonary Games",
//   "Doki Doki Literature Club!",
//   "Steins;Gate",
//   "The Legend of Heroes: Trails of Cold Steel IV",
//   "Ys VIII: Lacrimosa of Dana",
//   "Tales of Arise",
//   "Ni no Kuni II: Revenant Kingdom",
//   "Monster Hunter Rise",
//   "Pokken Tournament DX",
//   "ARMS",
//   "Ring Fit Adventure",
//   "Fitness Boxing",
//   "Just Dance 2021",
//   "Dance Dance Revolution",
//   "Beat Saber",
//   "Tetris Effect",
//   "Puyo Puyo Tetris",
//   "Lumines Remastered",
//   "Moss",
//   "Astro Bot Rescue Mission",
//   "Half-Life: Alyx",
//   "The Walking Dead: Saints & Sinners",
//   "Superhot VR",
//   "Iron Man VR",
//   "No Man's Sky VR",
//   "Minecraft Dungeons",
//   "Hearthstone",
//   "Gwent: The Witcher Card Game",
//   "Legends of Runeterra",
//   "Magic: The Gathering Arena",
//   "Yu-Gi-Oh! Duel Links",
//   "Shadowverse",
//   "Slay the Spire",
//   "Monster Train",
//   "Loop Hero",
//   "FTL: Faster Than Light",
//   "Into the Breach",
//   "Hearthstone Battlegrounds",
//   "Auto Chess",
//   "Teamfight Tactics",
//   "Dota Underlords",
//   "Clash Royale",
//   "Plants vs. Zombies",
//   "Angry Birds",
//   "Candy Crush Saga",
//   "Bejeweled",
//   "Monument Valley",
//   "Alto's Odyssey",
//   "Florence",
//   "Threes!",
//   "Mini Metro",
//   "Stardew Valley Mobile",
//   "Minecraft Earth",
//   "Pokemon Go",
//   "Harry Potter: Wizards Unite",
//   "Ingress",
//   "Clash of Clans",
//   "Brawl Stars",
//   "Among Us Mobile",
//   "PUBG Mobile",
//   "Call of Duty: Mobile",
//   "Fortnite Mobile",
//   "Genshin Impact Mobile",
//   "Mobile Legends: Bang Bang",
//   "Arena of Valor",
//   "Vainglory",
//   "Asphalt 9: Legends",
//   "Real Racing 3",
//   "Need for Speed: No Limits",
//   "CSR Racing 2",
//   "Pokemon Masters EX",
//   "Dragalia Lost",
//   "Fire Emblem Heroes",
//   "Animal Crossing: Pocket Camp",
//   "The Sims Mobile",
//   "SimCity BuildIt",
//   "Fallout Shelter",
//   "Star Wars: Galaxy of Heroes",
//   "Marvel Strike Force",
//   "Disney Sorcerer's Arena",
//   "Raid: Shadow Legends",
//   "AFK Arena",
//   "Idle Heroes",
//   "AdVenture Capitalist",
//   "Cookie Clicker",
//   "Egg, Inc.",
//   "BitLife",
//   "Reigns",
//   "Papers, Please",
//   "Plague Inc.",
//   "Rebel Inc.",
//   "SimCity",
//   "Cities: Skylines",
//   "Tropico 6",
//   "Surviving Mars",
//   "Anno 1800",
//   "Banished",
//   "Frostpunk",
//   "Age of Empires II: Definitive Edition",
//   "Civilization VI",
//   "Total War: Three Kingdoms",
//   "Crusader Kings III",
//   "Stellaris",
//   "Europa Universalis IV",
//   "Hearts of Iron IV",
//   "Factorio",
//   "Satisfactory",
//   "Kerbal Space Program",
//   "Space Engineers",
//   "Starbound",
//   "Terraria",
//   "Don't Starve",
//   "Oxygen Not Included",
//   "RimWorld",
//   "ARK: Survival Evolved",
//   "Rust",
//   "DayZ",
//   "7 Days to Die",
//   "Conan Exiles",
//   "The Forest",
//   "Green Hell",
//   "Subnautica",
//   "Astroneer",
//   "No Man's Sky",
//   "Elite Dangerous",
//   "Star Citizen",
//   "EVE Online",
//   "Warframe",
//   "Destiny 2",
//   "Tom Clancy's The Division 2",
//   "Anthem",
//   "Path of Exile",
//   "Diablo III",
//   "Torchlight II",
//   "Grim Dawn",
//   "Titan Quest",
//   "Marvel's Avengers",
//   "LEGO Marvel Super Heroes",
//   "LEGO Star Wars: The Skywalker Saga",
//   "LEGO Harry Potter Collection",
//   "LEGO City Undercover",
//   "LEGO Worlds",
//   "Portal 2",
//   "The Talos Principle",
//   "The Witness",
//   "Baba Is You",
//   "Human: Fall Flat",
//   "Getting Over It with Bennett Foddy",
//   "Surgeon Simulator",
//   "Goat Simulator",
//   "I Am Bread",
//   "Octodad: Dadliest Catch",
//   "Untitled Goose Game",
//   "Gang Beasts",
//   "Totally Accurate Battle Simulator",
//   "Mount & Blade II: Bannerlord",
//   "Chivalry 2",
//   "Mordhau",
//   "For Honor",
//   "Ghost Recon Breakpoint",
//   "Hitman 3",
//   "Hitman 2",
//   "Hitman (2016)",
//   "Splinter Cell: Blacklist",
//   "Thief",
// ];

// console.log("gamelenthtest", gameNames.length);
// const train = async () => {
//   try {
//     const allApps = await Task.find();
//     // allApps.forEach(async (app, i) => {
//     //   app.title = gameNames[i];
//     //   await app.save();
//     // });
//     console.log(allApps.length);
//     console.log(allApps.map((item) => item.image));
//   } catch (error) {
//     console.log(error);
//   }
// };
// train();

// app.get("/api/atef", async (_, res) => {
//   try {
//     const allApps = await Task.find();
//     // allApps.forEach(async (app, i) => {
//     //   app.title = gameNames[i];
//     //   await app.save();
//     // });
//     res.status(200).json(allApps);
//   } catch (error) {
//     console.log(error);
//   }
// });

io.on("connection", (socet) => {
  const userId = socet.handshake.query.userId;
  if (userId !== undefined) {
    onLineUsers[userId as string] = socet.id;
  }
  io.emit("online-users", Object.keys(onLineUsers));

  socet.on("new-user-joined", (newUser) => {
    io.emit("new-user-joined", newUser);
  });

  socet.on("user-updated", (updatedUser) => {
    io.emit("user-updated", updatedUser);
  });

  socet.on("public-message", (message) => {
    io.emit("public-message", message);
  });

  socet.on("interact-with-public-message", (updatedMessage) => {
    io.emit("interact-with-public-message", updatedMessage);
  });

  socet.on("conversation-readed", (data) => {
    io.to(onLineUsers[data.reciever]).emit("conversation-readed", data);
  });

  socet.on("disconnect", () => {
    const userId = socet.handshake.query.userId;
    delete onLineUsers[userId as string];
    io.emit("online-users", Object.keys(onLineUsers));
  });
});

server.listen(process.env.PORT, () => {
  connecteToMongodb();
  console.log(`success server Running on port: ${process.env.PORT}`);
});
