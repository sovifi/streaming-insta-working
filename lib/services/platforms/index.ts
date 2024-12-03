import { InstagramService } from './instagram'
import { TikTokService } from './tiktok'
import { TwitterService } from './twitter'
import { SpotifyService } from './spotify'
import { YouTubeService } from './youtube'
import { AppleMusicService } from './apple-music'

export const platformServices = {
  instagram: new InstagramService(),
  tiktok: new TikTokService(),
  twitter: new TwitterService(),
  spotify: new SpotifyService(),
  youtube: new YouTubeService(),
  'apple-music': new AppleMusicService(),
}

// Example of one service implementation: 