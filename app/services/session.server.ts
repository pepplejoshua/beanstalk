// see README.md of https://github.com/sergiodxa/remix-auth
import { createCookieSessionStorage } from "@remix-run/node";
import invariant from "tiny-invariant";

const ___s3cr3t___ = process.env.SESSION_SECRET;
invariant(___s3cr3t___, "You must provide a SESSION_SECRET env variable");

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__greenbean__session__",
    sameSite: "lax", // this helps with CSRF: https://www.cloudflare.com/learning/security/threats/cross-site-request-forgery/
    path: "/", // this lets the cookie work for all paths
    httpOnly: true, // restrict visibility. prevent client side js from accessing it
    secrets: [___s3cr3t___],
    secure: process.env.NODE_ENV === "production", // enable secure version only in production
    maxAge: 60 * 60 * 24, // cookie will expire after 1 day
  },
});