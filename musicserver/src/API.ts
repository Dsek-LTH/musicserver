"use server";
import {
  SpotifyApi,
  AccessToken,
  PlaybackState,
  Track,
} from "@spotify/web-api-ts-sdk";
import { execSync } from "child_process";
import { cookies, headers } from "next/headers";
import type { Queue } from "@spotify/web-api-ts-sdk";
import { log } from "./utils";
import { redirect } from "next/navigation";
import { permission } from "./auth";
import { SongQueue, SongQueueItem } from "./types";

let sdk: SpotifyApi | undefined;
let active_device: string | null;
let lastCalls = new Map<string, number>();
let customQueue: SongQueueItem[] = [];

let responseMessages: string[] = ["Insufficient permission"];

export async function updateAccessToken(accessToken: AccessToken) {
  if (accessToken.access_token === "emptyAccessToken") {
    log("Access token empty");
    return;
  }

  sdk = SpotifyApi.withAccessToken(
    process.env.CLIENT_ID as string,
    accessToken
  );

  log("Logged in to spotify");
  redirect("/");
}

export async function removeAccessToken() {
  sdk?.logOut();
  sdk = undefined;
  log("Logged out of spotify");
  redirect("/");
}

export async function search(query: string) {
  try {
    const response = await sdk?.search(query, ["track", "playlist", "album"]);
    log("Searched for " + query);
    return response;
  } catch (error: any) {
    console.log(error);
  }
}

export async function reorderCustomQueue(fromIndex: number, toIndex: number) {
  log("Reordering queue");
}

export async function removeFromCustomQueue(index: number, uri: string) {
  try {
    if (customQueue[index].track.uri == uri) {
      log("Removed song from queue");
      customQueue.splice(index, 1);
    }
    return { success: true, message: "Removed from user queue" };
  } catch {
    return { success: false, message: "Failed to remove from user queue" };
  }
}

export async function addToCustomQueue(track: Track, user?: string) {
  try {
    const cookieStore = await cookies();
    if (
      !(await permission(
        cookieStore.get("user")?.value,
        cookieStore.get("jwt")?.value
      ))
    )
      return { success: false, message: responseMessages[0] };
    if (
      customQueue.find((value: SongQueueItem, index: number) => {
        return value.track.uri == track.uri;
      })
    )
      return { success: false, message: "Already in queue" };
    const item = { track: track, user: user };
    customQueue.push(item);
    log("Added to custom queue");
    return { success: true, message: "Added to user queue" };
  } catch (error: any) {
    console.log(error);
    return activateDevice();
  }
}

export async function addToSpotifyQueue(track: Track) {
  try {
    await sdk?.player?.addItemToPlaybackQueue(track.uri, active_device!);
    log("Added to spotify queue");
  } catch (error: any) {
    console.log(error);
  }
}

export async function skipNext() {
  try {
    const cookieStore = await cookies();
    if (
      !(await permission(
        cookieStore.get("user")?.value,
        cookieStore.get("jwt")?.value
      ))
    )
      return { success: false, message: responseMessages[0] };
    if (customQueue.length > 0) {
      const a = customQueue.shift();
      if (a) await addToSpotifyQueue(a.track);
    }
    await sdk?.player?.skipToNext(active_device!);
    log("Skipped next");
    return { success: true, message: "Skipped to next track" };
  } catch (error: any) {
    log(error);
    return activateDevice();
  }
}

export async function skipBack() {
  try {
    const cookieStore = await cookies();
    if (
      !(await permission(
        cookieStore.get("user")?.value,
        cookieStore.get("jwt")?.value
      ))
    )
      return { success: false, message: responseMessages[0] };
    await sdk?.player?.skipToPrevious(active_device!);
    log("Skipped back");
    return { success: true, message: "Skipped to previous track" };
  } catch (error: any) {
    log(error);
    return activateDevice();
  }
}

export async function play(context_uri?: string, shuffle?: boolean) {
  try {
    const cookieStore = await cookies();
    if (
      !(await permission(
        cookieStore.get("user")?.value,
        cookieStore.get("jwt")?.value
      ))
    )
      return { success: false, message: responseMessages[0] };
    await sdk?.player.startResumePlayback(active_device!, context_uri);
    if (context_uri && shuffle) {
      await sdk?.player?.togglePlaybackShuffle(true);
    } else {
      await sdk?.player?.togglePlaybackShuffle(false);
    }
    lastCalls.set("queue", 0);
    log("Playing with shuffle " + shuffle);
    return {
      success: true,
      message: "Playing with shuffle " + shuffle,
    };
  } catch (error: any) {
    log(error);
    return activateDevice();
  }
}

export async function pause() {
  try {
    const cookieStore = await cookies();
    if (
      !(await permission(
        cookieStore.get("user")?.value,
        cookieStore.get("jwt")?.value
      ))
    )
      return { success: false, message: responseMessages[0] };
    await sdk?.player.pausePlayback(active_device!);
    log("Paused");
    return { success: true, message: "Paused playback" };
  } catch (error: any) {
    log(error);
    return activateDevice();
  }
}

async function activateDevice() {
  if ((await sdk?.getAccessToken()) == null)
    return { success: false, message: "No access token" };
  const response = await sdk?.player?.getAvailableDevices();
  console.log(response);
  response?.devices.forEach(async (element) => {
    const device_ids = [element?.id];
    await sdk?.player?.transferPlayback(device_ids as string[], true);
    log("Found device " + element.id);
    active_device = element.id;
    return { success: true, message: "Device found, activating..." };
  });
  return { success: false, message: "No device found" };
}

let queue: Queue | undefined;
export async function getQueue() {
  try {
    if (!sdk) return false;
    headers();
    const q = lastCalls.get("queue");
    if ((q && Date.now() - q > 5000) || !q) {
      queue = await sdk?.player?.getUsersQueue();
      lastCalls.set("queue", Date.now());
      log("Got queue");
    }
    const s: SongQueue = {
      queue: queue ?? undefined,
      customQueue,
    };
    return s;
  } catch (error: any) {
    console.log(error);
  }
}

export async function getAccessToken() {
  if (sdk === undefined) {
    return null;
  } else {
    return await sdk.getAccessToken();
  }
}

var playback: PlaybackState | undefined;
export async function getCurrentStatus() {
  try {
    if (!sdk) return false;
    headers();
    const s = lastCalls.get("status");
    if ((s && Date.now() - s > 5000) || !s) {
      playback = await sdk?.player?.getCurrentlyPlayingTrack();
      lastCalls.set("status", Date.now());
      log("Got playback state");
      if (
        playback?.item.duration_ms - playback?.progress_ms < 6000 &&
        customQueue.length > 0
      ) {
        const a = customQueue.shift();
        if (a) await addToSpotifyQueue(a.track);
      }
    }

    return playback;
  } catch (error: any) {
    log("Device not activated");
    return false;
  }
}

export async function setVolume(value: number) {
  try {
    const cookieStore = await cookies();
    if (
      !(await permission(
        cookieStore.get("user")?.value,
        cookieStore.get("jwt")?.value
      ))
    )
      return { success: false, message: responseMessages[0] };
    execSync(`pactl set-sink-volume @DEFAULT_SINK@ ${value}%`);
    return { success: true };
  } catch (error) {
    log("Volume set failed");
    return { success: false, message: "Couldn't set volume" };
  }
}

export async function getVolume() {
  try {
    const result = execSync(
      "pactl list sinks | grep '^[[:space:]]Volume:' | head -n $(( $SINK + 1 )) | tail -n 1 | sed -e 's,.* \\([0-9][0-9]*\\)%.*,\\1,'"
    ).toString();
    return result;
  } catch (error) {
    log("Couldn't get volume");
    return { success: false, message: "Couldn't get volume" };
  }
}
