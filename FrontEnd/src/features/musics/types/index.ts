export interface IMusicDetail {
  id: number;
  title: string;
  artist: { name: string };
  album: { cover: string };
  preview: string;
}

export interface IMusicInfo {
  id: string;
  artist: string;
  cover: string;
  title: string;
}
