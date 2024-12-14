export interface TypeFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture: string;
}

export interface TypeSearchItem {
  _id: string;
  title: string;
  link: string;
  description: string;
  image: string;
}

export interface TypeSearchResults {
  features: TypeSearchItem[];
  users: TypeSearchItem[];
  apps: TypeSearchItem[];
  frames: TypeSearchItem[];
  musics: TypeSearchItem[];
}

export interface TypeConversationSocketData {
  reciever: string;
  sender: string;
}

export interface TypeMusicDetail {
  id: number;
  title: string;
  artist: { name: string };
  album: { cover: string };
  preview: string;
}

export interface TypeUseScrollToElementHook {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies?: any[];
  scrollPosition?: "center" | "start" | "end" | "nearest";
  key?: string;
}
