export interface TypeFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture: File | null;
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
}
