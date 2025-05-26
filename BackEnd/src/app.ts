import path from "path";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import { connecteToMongodb } from "./db/connectToMongodb";
import routes from "./routes/routes";
import socketOperations from "./socketIo/socketIo";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20";
import { Strategy as GithubStrategy, Profile } from "passport-github2";
import User from "./models/user";
dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }
        user = await User.findOne({ email: profile.emails?.[0].value });

        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        if (!profile.emails) return done("google email does not exist");

        const newUser = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          profilePicture:
            profile.photos?.[0].value ||
            "https://res.cloudinary.com/dql5bc50n/image/upload/v1748245424/avatar_kqektj.jpg",
        });
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.log(error);
        done("Fail to Login with google - server error");
      }
    },
  ),
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "/api/auth/github/callback",
    },
    async (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user);
        }

        user = await User.findOne({ email: profile.emails?.[0].value });

        if (user) {
          user.githubId = profile.id;
          await user.save();
          return done(null, user);
        }

        const newUser = new User({
          githubId: profile.id,
          name: profile.displayName,
          email: `${profile.username}@users.noreply.github.com`,
          profilePicture:
            profile.photos?.[0].value ||
            "https://res.cloudinary.com/dql5bc50n/image/upload/v1748245424/avatar_kqektj.jpg",
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.log(error);
        done("Fail to Login with github - server error");
      }
    },
  ),
);

app.use(passport.initialize());

connecteToMongodb();

const server = http.createServer(app);

socketOperations(server);

app.use("/uploads", express.static(path.resolve("src/uploads")));

app.use(routes);

app.use((_, res) => {
  return res.status(500).json({
    error: "Internal server error",
  });
});

server.listen(process.env.PORT, () => {
  console.log(`success server Running on port: ${process.env.PORT}`);
});
