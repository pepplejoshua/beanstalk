// see README.md of https://github.com/sergiodxa/remix-auth
import { createCookieSessionStorage } from "@remix-run/node";

const ___s3cr3t___ = `It would be compromising if anyone learned that your character is terrified of being judged.
    It would be awkward if anyone learned that your character cannot ride a bicycle.
    Few know that your character murdered an untamed scientist.
    Few know that your character is terrified of embarassment.
    Few know that your character is terrified of thunder.
    It would be awkward if anyone learned that your character keeps a diary full of sensitive secrets.`;

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__greenbean__session__",
    sameSite: "lax", // this helps with CSRF: https://www.cloudflare.com/learning/security/threats/cross-site-request-forgery/
    path: "/", // this lets the cookie work for all paths
    httpOnly: true, // restrict visibility. prevent client side js from accessing it
    secrets: [___s3cr3t___],
    secure: process.env.NODE_ENV === "production", // enable secure version only in production
  },
});