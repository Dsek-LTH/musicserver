"use server";
import { promises as fs } from "fs";
import { JwtToken, Settings } from "./types";

import { addToCustomQueue, play, removeFromCustomQueue } from "./API";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { getWord } from "./words";

export async function log(message: string) {
  console.log(new Date().toUTCString() + ": " + message);
}

export async function getClientID() {
  log("Retrieving client id: " + process.env.CLIENT_ID);
  return process.env.CLIENT_ID as string;
}

export async function getRedirectUri() {
  if (process.env.DEV_BASE_URL) {
    log("Retrieving dev redirect uri: " + process.env.DEV_BASE_URL);
    return process.env.DEV_BASE_URL as string;
  }

  log("Retrieving redirect uri: " + process.env.BASE_URL);
  return process.env.BASE_URL as string;
}

export const playHandler = async (prevState: any, formData: FormData) => {
  "use server";
  const uri = formData.get("uri");
  const shuffle = formData.get("shuffle");
  if (!uri || !shuffle)
    return { success: false, message: "Invalid parameters" };
  return await play(uri.toString(), shuffle.toString() == "1");
};

export const addToQueueHandler = async (prevState: any, formData: FormData) => {
  "use server";
  const data = formData.get("track");
  const cookieStore = await cookies();
  let jwt: string | undefined = cookieStore.get("jwt")?.value;
  let user: string | undefined = undefined;
  if (!jwt) {
    const userid = cookieStore.get("user")?.value;
    if (userid) {
      user = (await getWord(userid)) as string;
    }
  } else {
    user = (jwtDecode(jwt) as JwtToken).preferred_username;
  }
  if (!data) return { success: false, message: "Invalid parameters" };
  const track = JSON.parse(data.toString());
  const response = await addToCustomQueue(track, user);
  return response;
};

export const removeFromQueueHandler = async (
  prevState: any,
  formData: FormData
) => {
  "use server";
  const data = formData.get("index");
  const uri = formData.get("uri");
  if (!data || !uri) return { success: false, message: "Invalid parameters" };
  try {
    const response = await removeFromCustomQueue(
      Number.parseInt(data.toString()),
      uri.toString()
    );
    return response;
  } catch {
    return { success: false, message: "Unable to parse index" };
  }
};

async function createSettingsFile() {
    const file = await fs.readFile(process.cwd() + "/settings.json", "utf8");
    const settings: Settings = JSON.parse(file);
    return settings;
}

export async function getSettings() {
  try {
    return createSettingsFile();
  } catch (err: any) {
    // If failed, and probably due to there not being a setting file previously, create a new one
    if (err.code === "ENOENT") {
      log("Settings file not found, creating a new one");
      await fs
        .writeFile(
          process.cwd() + "/settings.json",
          JSON.stringify({
            votingEnabled: null,
            enableGuests: null,
            requireAccount: null,
            bannedUsers: [],
            enableAdminRoles: [],
          }),
          "utf8"
        )
        .catch((err) => {
          console.log(err);
        });
      //return getSettings();
        return createSettingsFile();
    }
  }
}

export async function updateSettings(updatedSettings: Settings) {
  await fs.writeFile(
    process.cwd() + "/settings.json",
    JSON.stringify(updatedSettings),
    "utf8"
  );
}
