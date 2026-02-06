"use client";

import { PlaybackState } from "@spotify/web-api-ts-sdk";
import styles from './browse.module.css';

export default function Progress({playbackState} : {playbackState: PlaybackState}) {
  return (
    <div className={styles.progress}>
      <div style={{width: `${(playbackState?.progress_ms / playbackState?.item?.duration_ms) * 100}%`, height: "100%", backgroundColor: "gray", transition: `all ${playbackState?.progress_ms < 7000 ? 0 : 5}s linear`}}/>
    </div>
  )
}