import { Request } from 'express';

export interface User {
  id: string;
  username: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface SpotifyResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  external_urls: { spotify: string };
  preview_url: string | null;
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}