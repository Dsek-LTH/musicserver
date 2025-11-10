"use client";
import { useEffect, useState } from "react";
import ViewTrack from "./view_items/ViewTrack";
import { getQueue } from "@/API";
import { Queue, Track } from "@spotify/web-api-ts-sdk";
import { LoadingOutlined } from "@ant-design/icons";
import { SongQueue, SongQueueItem } from "@/types";

export default function ViewQueue() {
  const [tracks, setTracks] = useState<Track[]>();
  const [customTracks, setCustomTracks] = useState<SongQueueItem[]>();
  const [currentTrack, setCurrentTrack] = useState<Track>();
  const [loading, setLoading] = useState<boolean>(true);

  // Continuously fetches queue from server
  useEffect(() => {
    const data = getQueue();
    data.then((value: SongQueue | undefined | boolean) => {
      if (!value) return;
      setCustomTracks((value as SongQueue).customQueue);
      setTracks((value as SongQueue).queue?.queue as Track[]);
      setCurrentTrack((value as SongQueue).queue?.currently_playing as Track);
      setLoading(false);
    });

    setInterval(() => {
      const data = getQueue();
      data.then((value: SongQueue | undefined | boolean) => {
        if (!value) return;
        setCustomTracks((value as SongQueue).customQueue);
        setTracks((value as SongQueue).queue?.queue as Track[]);
        setCurrentTrack((value as SongQueue).queue?.currently_playing as Track);
        if (loading) setLoading(false);
      });
    }, 1000);
  }, []);

  return (
    <>
      {loading && (
        <div className="justify-center items-center flex w-full h-full text-[10vw] text-white">
          <LoadingOutlined />
        </div>
      )}
      {!loading && currentTrack !== null && tracks !== null && (
        <div className="h-full w-full box-border">
          <div className="bg-[#222] rounded-[10px] mb-[10px] border border-black border-solid">
            <div className="flex flex-row justify-start items-center">
              <h3 className="text-[2em] mt-3 mb-3 ml-1">Queue</h3>
            </div>
            <div className="mb-4 bg-[#333] rounded-sm">
              <h4 className="font-bold">Currently playing</h4>
              <ViewTrack track={currentTrack as Track} showButton={false} />
            </div>
            {customTracks && customTracks.length > 0 && (
              <>
                <h4 className="font-bold">User queue</h4>
                {customTracks.map((value: SongQueueItem, index: number) => (
                  <ViewTrack
                    key={index}
                    track={value.track}
                    showButton={false}
                    customQueueIndex={index}
                    user={value.user}
                  />
                ))}
              </>
            )}
            <h4 className="font-bold">Spotify queue</h4>
            {tracks?.map((track: Track, index: number, tracks: Track[]) => (
              <ViewTrack key={index} track={track} showButton={false} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
