"use client";
import styles from "../view.module.css";
import { PlayCircleFilled } from "@ant-design/icons";
import Image from "next/image";
import { PlaylistBase } from "@/types";
import { playHandler } from "@/utils";
import { useEffect } from "react";
import { Toast } from "../Toast";
import { useFormState } from "react-dom";

export default function ViewPlaylist({ playlist }: { playlist: PlaylistBase }) {
  const [state, formAction] = useFormState(playHandler, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.message == "") return;
    if (state.success) {
      Toast.add(state.message);
    } else {
      Toast.add(state.message, { type: "error" });
    }
  }, [state]);

  return (
    <div className={styles.smallContainer}>
      <form action={formAction}>
        <input type="hidden" name="uri" value={playlist?.uri} />
        <input type="hidden" name="shuffle" value={1} />
        <button type="submit" className={styles.button}>
          <PlayCircleFilled />
        </button>
      </form>
      <a
        className={styles.cover}
        target="_blank"
        href={playlist?.external_urls?.spotify}
      >
        <Image
          fill={true}
          sizes="50px"
          alt="Playlist's cover art"
          src={playlist?.images[0]?.url}
          className={styles.cover}
        />
      </a>
      <a
        href={playlist?.external_urls?.spotify}
        target="_blank"
        className={styles.title}
      >
        {playlist?.name}
      </a>
      <div className={styles.artist}>
        <a href={playlist?.owner?.external_urls?.spotify} target="_blank">
          {playlist?.owner?.display_name}
        </a>
      </div>
    </div>
  );
}
