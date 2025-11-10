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
    verify(jwt, await getPublicKey(), {
      algorithms: ["RS256"],
    });
    return true;
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
