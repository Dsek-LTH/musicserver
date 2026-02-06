"use server";

import axios from "axios";
import { verify } from "jsonwebtoken";
import { getSettings } from "./utils";
import { jwtDecode } from "jwt-decode";
import { JwtToken } from "./types";

export async function permission(
  guest: string | undefined,
  jwt: string | undefined
) {
  const settings = await getSettings();
  if (
    jwt &&
    (await auth(jwt)) &&
    settings?.bannedUsers.find(
      (name) => name == (jwtDecode(jwt) as JwtToken).preferred_username
    ) != undefined
  ) {
    return false;
  }

  // If no account is required, allow everyone
  if (!settings?.requireAccount) return true;
  if (jwt && (await auth(jwt))) {
    return true;
  } else if (settings.enableGuests && guest && guest.length > 4) {
    return true;
  }

  return false;
}

export async function auth(jwt: string) {
  try {
    const reponse = await axios.post(process.env.AUTH_INTROSPECT_URL!, `token=${jwt}`, {headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      "Authorization": `Basic ${Buffer.from(`${process.env.AUTH_CLIENT_ID}:${process.env.AUTH_CLIENT_SECRET}`).toString('base64')}`
    }})
    /*verify(jwt, await getPublicKey(), {
      algorithms: ["RS256"],
    });*/
    console.log({reponse});
    return reponse.data.active;
  } catch (err) {
    return false;
  }
}

async function getPublicKey() {
  const response = await axios.get(
    process.env.AUTH_URL + ""
  );
  const public_key =
    (("-----BEGIN PUBLIC KEY-----\n" + response.data.public_key) as string) +
    "\n-----END PUBLIC KEY-----";
  return public_key;
}
