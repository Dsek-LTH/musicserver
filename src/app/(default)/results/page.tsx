import { PlaylistBase } from "@/types";
import { addToCustomQueue, play, search } from "@/API";
import ViewTrack from "@/components/view_items/ViewTrack";
import { SimplifiedAlbum, Track } from "@spotify/web-api-ts-sdk";
import ViewPlaylist from "@/components/view_items/ViewPlaylist";
import ViewAlbum from "@/components/view_items/ViewAlbum";
import { redirect } from "next/navigation";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const searchQuery = searchParams["search"];
  if (!searchQuery) {
    redirect("/");
  }

  const data = await search(searchQuery as string);

  return (
    <div className="w-full box-border pb-52">
      <div className="bg-[#222] rounded-xl mb-3 border border-solid border-black">
        <h3 className="text-[2em] mt-2 mb-2 ml-1 text-white">Tracks</h3>
        {data?.tracks?.items.map((track: Track, index: number) => (
          <ViewTrack key={index} track={track} />
        ))}
      </div>
      <div className="bg-[#222] rounded-xl mb-3 border border-solid border-black">
        <h3 className="text-[2em] mt-2 mb-2 ml-1 text-white">Playlists</h3>
        {data?.playlists?.items.map((playlist: PlaylistBase, index: number) => (
          <ViewPlaylist key={index} playlist={playlist} />
        ))}
      </div>
      <div className="bg-[#222] rounded-xl mb-14 border border-solid border-black">
        <h3 className="text-[2em] mt-2 mb-2 ml-1 text-white">Albums</h3>
        {data?.albums?.items.map((album: SimplifiedAlbum, index: number) => (
          <ViewAlbum key={index} album={album} />
        ))}
      </div>
    </div>
  );
}
