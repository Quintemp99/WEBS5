import { TRoutesInput } from "../types/routes";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default ({ app }: TRoutesInput) => {
  app.post("/login", (req, res, next) => {
    passport.authenticate("login", async (err: any, user: any, info: any) => {
      try {
        if (err || !user) {
          return next(`An error occurred: ${info.message}`);
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const body = { _id: user._id, email: user.email, roles: user.roles };
          const token = jwt.sign({ user: body }, process.env.JWT_SECRET || "", {
            expiresIn: "1h",
          });

          return res.json({ token });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });

  app.post(
    "/register",
    passport.authenticate("register", { session: false }),
    async (req, res, next) => {
      res.status(201).json({
        message: "Signup successful",
        user: req.user,
      });
    }
  );

  // Handle errors.
  app.use(function (err: any, req: any, res: any, next: any) {
    res.status(err.status || 500);
    res.json({ error: err });
  });
};
