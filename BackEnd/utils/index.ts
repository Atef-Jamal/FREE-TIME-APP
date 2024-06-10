export const generateNewWeekRewards = (startDay?: Date) => {
  const newWeekRewards = [...Array(7).keys()].map((item) => {
    if (startDay) {
      return {
        day: item + 1,
        availableAt: new Date(
          new Date(new Date().setHours(0, 0, 0, 0)).setDate(
            startDay.getDate() + item + 1
          )
        ),
        isCollected: false,
        reward: 50 * (item + 1),
      };
    } else {
      return {
        day: item + 1,
        availableAt: new Date(
          new Date(new Date().setHours(0, 0, 0, 0)).setDate(
            new Date().getDate() + item
          )
        ),
        isCollected: false,
        reward: 50 * (item + 1),
      };
    }
  });

  return newWeekRewards;
};
