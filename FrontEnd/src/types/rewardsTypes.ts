export interface IBounusCode {
  _id: string;
  code: string;
  prize: number;
  expirationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDailyReward {
  day: number;
  availableAt: string;
  reward: number;
  isCollected: boolean;
}
