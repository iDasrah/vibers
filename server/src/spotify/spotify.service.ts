import { HttpException, Injectable } from '@nestjs/common';
import { SpotifyResponse, SpotifySearchResponse, SpotifyTrack } from '../types';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SpotifyService {
  constructor(private prisma: PrismaService) {}
  private accessToken: string | null = null;
  private tokenExpiration: number | null = null;

  private isTokenExpired() {
    return !this.tokenExpiration || Date.now() >= this.tokenExpiration;
  }

  private async getAccessToken() {
    if (this.accessToken && !this.isTokenExpired()) {
      return this.accessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new HttpException('Spotify credentials are not set', 500);
    }

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      form: {
        grant_type: 'client_credentials',
      },
      json: true,
    };

    try {
      const response = await fetch(authOptions.url, {
        method: authOptions.method,
        headers: authOptions.headers,
        body: new URLSearchParams(authOptions.form),
      });

      if (!response.ok) {
        throw new HttpException(
          'Failed to fetch access token from Spotify',
          response.status,
        );
      }

      const data = (await response.json()) as SpotifyResponse;

      this.accessToken = data.access_token;
      this.tokenExpiration = Date.now() + (data.expires_in - 30) * 1000;

      return data.access_token;
    } catch (error) {
      console.error('Error fetching access token from Spotify:', error);
      throw new HttpException('Error fetching access token from Spotify ', 500);
    }
  }

  async searchTracks(query: string) {
    const accessToken = await this.getAccessToken();
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new HttpException(
          'Failed to search tracks on Spotify',
          response.status,
        );
      }

      const data = (await response.json()) as SpotifySearchResponse;
      const tracks = data.tracks.items.map((item) => ({
        id: item.id,
        name: item.name,
        artists: item.artists.map((artist) => ({ name: artist.name })),
        album: {
          images: item.album.images,
        },
        external_urls: item.external_urls,
        preview_url: item.preview_url || null,
      }));
      await this.saveTracksToDb(tracks);
      return tracks;
    } catch (error) {
      console.error('Error searching tracks on Spotify:', error);
      throw new HttpException('Error searching tracks on Spotify', 500);
    }
  }

  saveTracksToDb(tracks: SpotifyTrack[]) {
    return this.prisma.$transaction(async (prisma) => {
      const trackPromises = tracks.map((track) =>
        prisma.track.upsert({
          where: { id: track.id },
          update: {},
          create: {
            name: track.name,
            artists: {
              connectOrCreate: track.artists.map((artist) => ({
                where: { name: artist.name },
                create: { name: artist.name },
              })),
            },
            imageUrl: track.album.images[0]?.url || null,
            spotifyUrl: track.external_urls.spotify,
          },
        }),
      );

      return Promise.all(trackPromises);
    });
  }
}
