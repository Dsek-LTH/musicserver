"use client";
import styles from "../view.module.css";
import { PlusCircleFilled, MinusCircleFilled } from "@ant-design/icons";
import { SimplifiedArtist, Track } from "@spotify/web-api-ts-sdk";
import Image from "next/image";
import { useFormState } from "react-dom";
import { addToQueueHandler, removeFromQueueHandler } from "@/utils";
import { useEffect } from "react";
import { Toast } from "../Toast";

export default function ViewTrack({
  track,
  showButton,
  customQueueIndex,
  user,
}: {
  track: Track;
  showButton?: boolean;
  customQueueIndex?: number;
  user?: string;
}) {
  const [state, formAction] = useFormState(addToQueueHandler, {
    success: false,
    message: "",
  });
  const [removeState, removeFormAction] = useFormState(removeFromQueueHandler, {
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

  useEffect(() => {
    if (removeState.message == "") return;
    if (removeState.success) {
      Toast.add(removeState.message);
    } else {
      Toast.add(removeState.message, { type: "error" });
    }
  }, [removeState]);

  return (
    <div className={styles.smallContainer}>
      {showButton !== false && (
        <form action={formAction}>
          <input type="hidden" name="track" value={JSON.stringify(track)} />
          <input type="hidden" name="user" value={""} />
          <button type="submit" className={styles.button}>
            <PlusCircleFilled className="justify-center" />
          </button>
        </form>
      )}
      <a
        className={styles.cover}
        target="_blank"
        href={track?.album?.external_urls?.spotify}
      >
        <Image
          fill={true}
          sizes="50px"
          alt="Song's album cover art"
          src={track?.album?.images[0]?.url}
          className={styles.cover}
        />
      </a>
      <a
        href={track?.external_urls?.spotify}
        target="_blank"
        className={styles.title}
      >
        {track?.name}
      </a>
      <div className={styles.artist}>
        {track?.artists?.map(
          (
            artist: SimplifiedArtist,
            index2: number,
            artists: SimplifiedArtist[]
          ) => (
            <GetArtist
              key={index2}
              artist={artist}
              index={index2}
              artists={artists}
            />
          )
        )}
      </div>
      {user && <span className="min-w-20 text-xs mr-2">Queued by: {user}</span>}
      {(customQueueIndex || customQueueIndex == 0) && (
        <form action={removeFormAction}>
          <input type="hidden" name="index" value={customQueueIndex} />
          <input type="hidden" name="uri" value={track.uri} />
          <button type="submit" className={styles.button}>
            <MinusCircleFilled className="justify-center" />
          </button>
        </form>
      )}
      <p className={styles.duration}>{getTime(track?.duration_ms)}</p>
    </div>
  );
}

export function getTime(originalTime: number) {
  let minutes = Math.floor((originalTime / (1000 * 60)) % 60);
  let seconds = Math.floor((originalTime / 1000) % 60);

  let minutesString = minutes < 10 ? "0" + minutes : minutes;
  let secondsString = seconds < 10 ? "0" + seconds : seconds;

  return minutesString + ":" + secondsString;
}

export function GetArtist({
  artist,
  index,
  artists,
}: {
  artist: SimplifiedArtist;
  index: number;
  artists: SimplifiedArtist[];
}) {
  if (index == artists.length - 1) {
    return (
      <p>
        {" "}
        <a
          href={artist?.external_urls?.spotify}
          target="_blank"
          key={index}
          className={styles.artistlink}
        >
          {artist.name}
        </a>{" "}
      </p>
    );
  } else {
    return (
      <p>
        {" "}
        <a
          href={artist?.external_urls?.spotify}
          target="_blank"
          key={index}
          className={styles.artistlink}
        >
          {artist.name}
        </a>
        &nbsp;-&nbsp;
      </p>
    );
  }
}
