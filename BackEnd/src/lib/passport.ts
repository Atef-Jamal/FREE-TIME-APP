import User from "../models/user.js";
import passport from "passport";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20";
import { Strategy as GithubStrategy, Profile } from "passport-github2";
import { generateNewWeekRewards } from "../utils/index.js";

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_BASE_URL}/api/auth/google/callback`,
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
          user.emailVerified = true;
          await user.save();
          return done(null, user);
        }

        if (!profile.emails) return done("google email does not exist");

        const newUser = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          emailVerified: true,
          dailyReward: generateNewWeekRewards(),
        });

        if (profile.photos?.[0].value) {
          newUser.profilePicture = profile.photos?.[0].value;
        }

        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (error) {
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
      callbackURL: `${process.env.SERVER_BASE_URL}/api/auth/github/callback`,
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
          user.emailVerified = true;
          await user.save();
          return done(null, user);
        }

        const newUser = new User({
          githubId: profile.id,
          name: profile.displayName,
          email: `${profile.username}@users.noreply.github.com`,
          emailVerified: true,
          dailyReward: generateNewWeekRewards(),
        });

        if (profile.photos?.[0].value) {
          newUser.profilePicture = profile.photos[0].value;
        }

        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (error) {
        done("Fail to Login with github - server error");
      }
    },
  ),
);

export default passport;
