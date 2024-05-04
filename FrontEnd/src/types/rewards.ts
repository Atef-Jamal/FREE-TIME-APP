export interface TypeBounusCode {
  _id: string;
  code: string;
  prize: number;
  expirationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TypeDailyReward {
  day: number;
  isCollected: boolean;
  reward: number;
}
