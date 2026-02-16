import { hasAccessToken } from "@/API";
import styles from "./page.module.css";
import Player from "@/components/Player";
import ViewQueue from "@/components/ViewQueue";

export default async function Home() {
  const accessToken = await hasAccessToken();
  if (!accessToken) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="">Not logged into Spotify</h1>
      </div>
    );
  }
  return (
    <div className={styles.main}>
      <ViewQueue />
    </div>
  );
}
