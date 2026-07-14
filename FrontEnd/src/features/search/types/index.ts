export interface ISearchItem {
  _id: string;
  title: string;
  link: string;
  description: string;
  image: string;
}

export interface ISearchResults {
  features: ISearchItem[];
  users: ISearchItem[];
  offers: ISearchItem[];
  frames: ISearchItem[];
  musics: ISearchItem[];
}
