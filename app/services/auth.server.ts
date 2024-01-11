import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import type { User } from "@prisma/client";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import * as bcrypt from "bcrypt";
import { prisma } from "./prisma.server";

export type AuthenticatedUser = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  company_role: string;
};

// create an authenticator instance
export let authenticator = new Authenticator<AuthenticatedUser>(sessionStorage, {
  sessionErrorKey: 'auth-session-error',
  sessionKey: 'auth-session',
});
   
authenticator.use(
  new FormStrategy(async ({ form, context }) => {
    let user_identification = form.get('user_identification');
    let password = form.get('password');

    invariant(typeof user_identification === "string", "user_identification must be a string");
    invariant(user_identification.length > 0, "user_identification must not be empty");

    invariant(typeof password === "string", "user_identification must be a string");
    invariant(password.length >= 8, "password must be at least 8 characters long");

    // try to find existing user
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let is_email = regex.test(user_identification);
    const user_ = await prisma.user.findUnique({
      where: {
        email: is_email ? user_identification : undefined,
        username: is_email ? undefined : user_identification,
      },
    });
    if (!user_) {
      throw new Error(`no user was found with this ${is_email ? 'email' : 'username'}. reach out to iwarilama.`);
    }

    const user = user_ as User;
    let is_matching_password = await bcrypt.compare(password, user.password);
    if (!is_matching_password) {
      throw new Error(`the password is incorrect.`);
    }
    return user;
  }),
  'gbf_login'
);