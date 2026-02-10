"use client";
import styles from "./player.module.css";
import {
  LeftOutlined,
  RightOutlined,
  PlayCircleFilled,
  PauseCircleFilled,
  UpCircleFilled,
  DownCircleFilled,
} from "@ant-design/icons";
import { getCurrentStatus, pause, play, skipBack, skipNext } from "@/API";
import {
  PlaybackState,
  SimplifiedArtist,
  Track,
} from "@spotify/web-api-ts-sdk";
import { useEffect, useState } from "react";
import Image from "next/image";
import { GetArtist } from "./view_items/ViewTrack";
import Progress from "./Progress";
import { Toast } from "./Toast";
import { APIResponse } from "@/types";

export default function Player() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [infoHide, setInfoHide] = useState<boolean>(true);
  const [currentTrack, setCurrentTrack] = useState<PlaybackState>();

  // useEffect(() => {
  //   getCurrentlyPlaying();
  //   setInterval(getCurrentlyPlaying, 1000);
  // }, []);

  const getCurrentlyPlaying = async () => {
    const data = await getCurrentStatus();
    if (data !== false && data !== undefined) {
      setCurrentTrack(data);
      setPlaying(data?.is_playing);
    }
  };

  const back = async () => {
    const response: APIResponse = await skipBack();
    if (response.success) {
      setPlaying(true);
      Toast.add(response.message);
    } else {
      Toast.add(response.message);
    }
  };

  const resume = async () => {
    const response = await play();
    if (response.success) {
      setPlaying(true);
      play();
      Toast.add(response.message);
    } else {
      Toast.add(response.message);
    }
  };

  const stop = async () => {
    const response: APIResponse = await pause();
    if (response.success) {
      setPlaying(false);
      pause();
      Toast.add(response.message);
    } else {
      Toast.add(response.message);
    }
  };

  const forward = async () => {
    const response: APIResponse = await skipNext();
    if (response.success) {
      setPlaying(true);
      Toast.add(response.message);
    } else {
      Toast.add(response.message);
    }
  };

  const hide = () => {
    setInfoHide(!infoHide);
  };

  const artistList = () => {
    if (currentTrack != null) {
      const t = currentTrack.item as Track;
      return (
        <p>
          {t.artists.map(
            (
              artist: SimplifiedArtist,
              index: number,
              artists: SimplifiedArtist[],
            ) => {
              return (
                <a className={styles.link} href={artist.external_urls.spotify}>
                  {artist.name}
                </a>
              );
            },
          )}
        </p>
      );
    } else {
      return (
        <p>
          <a className={styles.link} href="">
            Placeholder artists
          </a>
        </p>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={infoHide ? styles.infoHide : styles.info} onClick={hide}>
        <div
          style={{ position: "relative", height: "100%", aspectRatio: "1 / 1" }}
        >
          <Image
            fill={true}
            sizes="300px"
            alt="Song's album cover art"
            className={styles.icon}
            src={
              (currentTrack?.item as Track)?.album?.images[0]?.url ??
              "/placeholder-album-cover.jpg"
            }
          />
        </div>
        <div className={styles.infoTextWrapper}>
          <div className={styles.infoText}>
            <div className={styles.marquee}>
              <p>
                <a
                  className={styles.link}
                  href={currentTrack?.item?.external_urls?.spotify}
                >
                  {currentTrack != null
                    ? currentTrack?.item?.name
                    : "Placeholder song name"}
                </a>
              </p>
              <p>
                <a
                  className={styles.link}
                  href={currentTrack?.item?.external_urls?.spotify}
                >
                  {currentTrack != null
                    ? currentTrack?.item?.name
                    : "Placeholder song name"}
                </a>
              </p>
              <p>
                <a
                  className={styles.link}
                  href={currentTrack?.item?.external_urls?.spotify}
                >
                  {currentTrack != null
                    ? currentTrack?.item?.name
                    : "Placeholder song name"}
                </a>
              </p>
            </div>
            <div className={styles.marquee}>
              {artistList()}
              {artistList()}
              {artistList()}
            </div>
          </div>
        </div>
        <button className={styles.infoButton} type="button" onClick={hide}>
          {infoHide ? (
            <UpCircleFilled
              className={`${styles.icon} ${styles.small} ${styles.infoIndicator}`}
            />
          ) : (
            <DownCircleFilled
              className={`${styles.icon} ${styles.small} ${styles.infoIndicator}`}
            />
          )}
        </button>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} type="button" onClick={back}>
          <LeftOutlined className={`${styles.icon} ${styles.small}`} />
        </button>
        {playing && (
          <button className={styles.button} type="button" onClick={stop}>
            <PauseCircleFilled className={styles.icon} />
          </button>
        )}
        {!playing && (
          <button className={styles.button} type="button" onClick={resume}>
            <PlayCircleFilled className={styles.icon} />
          </button>
        )}
        <button className={styles.button} type="button" onClick={forward}>
          <RightOutlined className={`${styles.icon} ${styles.small}`} />
        </button>
      </div>
      <Progress playbackState={currentTrack as PlaybackState} />
    </div>
  );
}
