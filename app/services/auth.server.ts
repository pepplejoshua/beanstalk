import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import type { User } from "@prisma/client";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";
import * as bcrypt from "bcrypt";
import { prisma } from "./prisma.server";

export let authenticator = new Authenticator<User>(sessionStorage);

// TODO(@pepplejoshua): replace the User type with a leaner type that only 
// contains the necessary fields
authenticator.use(
  new FormStrategy(async ({ form, context }) => {
    let user_identification = form.get('user_identification');
    let password = form.get('password');

    invariant(typeof user_identification === "string", "user_identification must be a string");
    invariant(user_identification.length > 0, "user_identification must not be empty");

    invariant(typeof password === "string", "user_identification must be a string");
    invariant(password.length > 0, "user_identification must not be empty");

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