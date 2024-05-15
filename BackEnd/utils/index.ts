import User from "../models/user";

export const grantRewardsToAllUsers = async () => {
  const users = await User.find().select("dailyReward");

  users.forEach(async (user) => {
    if (user.dailyReward.days.length === 7) {
      if (
        !user.dailyReward.days.some((item: any) => item.isCollected === false)
      ) {
        user.dailyReward = {
          week: user.dailyReward.week + 1,
          days: [{ day: 1, isCollected: false, reward: 50 }],
        };

        await user.save();
      }
    } else {
      const previosDay =
        user.dailyReward.days[user.dailyReward.days.length - 1];
      const newObj = {
        day: previosDay.day + 1,
        isCollected: false,
        reward: previosDay.day * 50,
      };
      user.dailyReward = {
        ...user.dailyReward,
        days: [...user.dailyReward.days, newObj],
      };

      await user.save();
    }
  });
};
