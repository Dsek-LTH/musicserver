import styles from "./view.module.css";
import { PlaylistBase } from "@/types";
import { addToCustomQueue, play } from "@/API";
import ViewTrack from "./view_items/ViewTrack";
import {
  PartialSearchResult,
  SimplifiedAlbum,
  Track,
} from "@spotify/web-api-ts-sdk";
import ViewPlaylist from "./view_items/ViewPlaylist";
import ViewAlbum from "./view_items/ViewAlbum";

export default function View({
  props,
}: {
  props: Pick<PartialSearchResult, "albums" | "playlists" | "tracks">;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.rowContainer}>
        <h3 className={styles.rowTitle}>Tracks</h3>
        {props?.tracks?.items
          .filter((x) => x !== null)
          .map((track: Track, index: number) => (
            <ViewTrack key={index} track={track} />
          ))}
      </div>
      <div className={styles.rowContainer}>
        <h3 className={styles.rowTitle}>Playlists</h3>
        {props?.playlists?.items
          .filter((x) => x !== null)
          .map((playlist: PlaylistBase, index: number) => (
            <ViewPlaylist key={index} playlist={playlist} />
          ))}
      </div>
      <div className={styles.rowContainer}>
        <h3 className={styles.rowTitle}>Albums</h3>
        {props?.albums?.items
          .filter((x) => x !== null)
          .map((album: SimplifiedAlbum, index: number) => (
            <ViewAlbum key={index} album={album} />
          ))}
      </div>
    </div>
  );
}
