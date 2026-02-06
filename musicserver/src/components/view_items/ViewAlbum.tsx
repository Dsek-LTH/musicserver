"use client";
import styles from "../view.module.css";
import { PlayCircleFilled } from "@ant-design/icons";
import Image from "next/image";
import { SimplifiedAlbum, SimplifiedArtist } from "@spotify/web-api-ts-sdk";
import { GetArtist } from "./ViewTrack";
import { useEffect } from "react";
import { Toast } from "../Toast";
import { useFormState } from "react-dom";
import { playHandler } from "@/utils";

export default function ViewAlbum({ album }: { album: SimplifiedAlbum }) {
  const [state, formAction] = useFormState(playHandler, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.message == "") return;
    if (state.success) {
      Toast.add(state.message);
    } else if (state.message) {
      Toast.add(state.message, { type: "error" });
    }
  }, [state]);

  return (
    <div className={styles.smallContainer}>
      <form action={formAction}>
        <input type="hidden" name="uri" value={album?.uri} />
        <input type="hidden" name="shuffle" value={0} />
        <button type="submit" className={styles.button}>
          <PlayCircleFilled />
        </button>
      </form>
      <a
        className={styles.cover}
        target="_blank"
        href={album?.external_urls?.spotify}
      >
        <Image
          fill={true}
          sizes="50px"
          alt="Playlist's cover art"
          src={album?.images[0]?.url}
          className={styles.cover}
        />
      </a>
      <a
        href={album?.external_urls?.spotify}
        target="_blank"
        className={styles.title}
      >
        {album?.name}
      </a>
      <div className={styles.artist}>
        {album?.artists?.map(
          (
            artist: SimplifiedArtist,
            index: number,
            artists: SimplifiedArtist[],
          ) => (
            <GetArtist
              key={index}
              artist={artist}
              index={index}
              artists={artists}
            />
          ),
        )}
      </div>
      <p className={styles.duration}>{album?.release_date}</p>
    </div>
  );
}
