export const generateNewWeekRewards = (startDay = new Date()) => {
  const newWeekRewards = [...Array(7).keys()].map((item) => {
    const clonedDate = new Date(startDay);
    clonedDate.setHours(0, 0, 0, 0);
    clonedDate.setDate(clonedDate.getDate() + item);
    return {
      day: item + 1,
      availableAt: clonedDate,
      isCollected: false,
      reward: 50 * (item + 1),
    };
  });

  return newWeekRewards;
};

export const getActiveConversationKey = (firstUserId: string, secondUserId: string) => {
  return firstUserId > secondUserId ? `${firstUserId}-${secondUserId}` : `${secondUserId}-${firstUserId}`;
};
