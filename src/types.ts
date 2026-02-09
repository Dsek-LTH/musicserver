import {
  ExternalUrls,
  Followers,
  UserReference,
  Image,
  Track,
  Queue,
} from "@spotify/web-api-ts-sdk";

export interface SongQueue {
  queue: Queue | undefined;
  customQueue: SongQueueItem[];
}

export interface SongQueueItem {
  track: Track;
  user?: string;
}

export interface PlaylistBase {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: UserReference;
  primary_color: string;
  public: boolean;
  snapshot_id: string;
  type: string;
  uri: string;
}

export interface JwtToken {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  "allowed-origins": [string];
  scope: string;
  sid: string;
  email_verified: boolean;
  group_list: [string];
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

export interface Settings {
  votingEnabled: string;
  enableGuests: string;
  requireAccount: string;
  bannedUsers: string[];
  enableAdminRoles: string[];
}

export interface APIResponse {
  success: boolean;
  message: string;
}
