import { getAccessToken } from "@/API";
import styles from "./page.module.css";
import Player from "@/components/Player";
import ViewQueue from "@/components/ViewQueue";

export default async function Home() {
  const accessToken = await getAccessToken();
  if (accessToken == null) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="">Spotify session not activated! Contact admin!</h1>
      </div>
    );
  }
  return (
    <div className={styles.main}>
      <ViewQueue />
    </div>
  );
}
