"use client";

import { getCurrentStatus } from "@/API";
import { PlaybackState, Track } from "@spotify/web-api-ts-sdk";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./playerfullscreen.module.css";

export default function PlayerFullscreen() {
  const [currentTrack, setCurrentTrack] = useState<PlaybackState>();

  useEffect(() => {
    getCurrentlyPlaying();
    setInterval(getCurrentlyPlaying, 6000);
  }, []);

  const getCurrentlyPlaying = async () => {
    const data = await getCurrentStatus();
    if (data !== false && data !== undefined) {
      setCurrentTrack(data);
    }
  };

  return (
    <div>
      {currentTrack && (
        <div className={styles.container}>
          <div
            className={styles.background}
            style={{
              backgroundImage: `url(${(currentTrack?.item as Track)?.album?.images[0].url})`,
            }}
          ></div>
          <p className={styles.link}>
            Queue tracks at: {window.location.origin}
          </p>
          <img
            className={styles.cover}
            src={(currentTrack?.item as Track)?.album?.images[0].url}
          />
          <p className={styles.title}>{currentTrack?.item?.name}</p>
          <p className={styles.artists}>
            {(currentTrack?.item as Track)?.artists[0].name}
          </p>
        </div>
      )}
      {!currentTrack && (
        <>
          <h1>Song is not playing &gt;.&gt; uwu </h1>
          <Link href="/">Home</Link>
        </>
      )}
    </div>
  );
}
