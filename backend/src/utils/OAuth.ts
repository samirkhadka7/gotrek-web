import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User from '../models/user.model';

const callbackURL = `${process.env.API_URL}/auth/google/callback`;

console.log('PASSPORT GOOGLE-STRATEGY | Using callbackURL:', callbackURL);

// Serialize user for the session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: callbackURL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: Error | null, user?: Express.User | false) => void
    ) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails![0].value,
          });
        }
        done(null, user);
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  )
);
