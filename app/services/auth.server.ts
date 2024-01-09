import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import type { User } from "@prisma/client";
import { FormStrategy } from "remix-auth-form";
import invariant from "tiny-invariant";

export let authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form, context }) => {
    let user_identification = form.get('user_identification');
    let password = form.get('password');

    invariant(typeof user_identification === "string", "user_identification must be a string");
    invariant(user_identification.length > 0, "user_identification must not be empty");

    invariant(typeof password === "string", "user_identification must be a string");
    invariant(password.length > 0, "user_identification must not be empty");

  })
);