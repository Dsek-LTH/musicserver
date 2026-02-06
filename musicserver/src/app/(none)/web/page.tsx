import { getAccessToken } from "@/API";
import PlayerFullscreen from "@/components/PlayerFullscreen";

export default async function Web() {
  // This page doesn't work unless this is called?
  // console.log(await getAccessToken());

  // This page needs to interact with backend otherwise it won't be able to get currently playing songs?
  const loggedIn = await getAccessToken();
  if (!loggedIn?.access_token) {
    return <h1>Not logged in!</h1>;
  }

  return <PlayerFullscreen />;
}
