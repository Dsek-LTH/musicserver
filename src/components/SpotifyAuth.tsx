"use client";

import { getAccessToken, updateAccessToken } from "@/API";
import { getClientID, getRedirectUri } from "@/utils";
import { AccessToken, SpotifyApi } from "@spotify/web-api-ts-sdk";

export default function SpotifyAuth() {
  const loginSpotify = () => {
    getAccessToken().then(async (value: AccessToken | null) => {
      if (value === null) {
        console.log("No access token! Fetching a new one from spotify.");
        const clientid = await getClientID();
        const redirectUri = await getRedirectUri();
        SpotifyApi.performUserAuthorization(
          clientid,
          redirectUri + "admin",
          [
            "user-read-playback-state",
            "user-read-private",
            "user-modify-playback-state",
            "user-read-currently-playing",
            "app-remote-control",
            "streaming",
            "playlist-read-private",
            "playlist-read-collaborative",
            "playlist-modify-private",
            "playlist-modify-public",
            "user-top-read",
            "user-read-recently-played",
            "user-library-modify",
            "user-library-read",
          ],
          (accessToken) => updateAccessToken(accessToken),
        );
      }
    });
  };

  return (
    <button
      onClick={loginSpotify}
      className="box-border w-full transform bg-green-600 p-2 transition hover:scale-105"
    >
      Login to spotify
    </button>
  );
}
