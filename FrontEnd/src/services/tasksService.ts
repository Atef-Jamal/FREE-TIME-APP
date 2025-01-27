import { makeRequest } from "./config";
import { IFilterByDevice, IFilterByPopularity, IReview, ITask } from "../types/earnTypes";

export const fetchAllTasks = async ({
  filterByPopularity,
  filterByDevice,
  pageParam,
  limitPerPage,
}: {
  filterByPopularity: IFilterByPopularity;
  filterByDevice: IFilterByDevice;
  limitPerPage: number;
  pageParam: number;
}): Promise<{ tasks: ITask[]; hasMore: boolean }> => {
  const response = await makeRequest.get(
    `api/tasks?filterByPopularity=${filterByPopularity}&&filterByDevice=${filterByDevice}&&pageParam=${pageParam}&&limitedPerPage=${limitPerPage}`,
  );
  const data = response.data;
  return data;
};

export const handleAddReview = async ({
  taskId,
  comment,
}: {
  taskId: string;
  comment: string;
}): Promise<IReview> => {
  const response = await makeRequest.post(`/api/tasks/${taskId}/review`, {
    comment,
  });
  const review = response.data;
  return review;
};

export const fetchAppDetails = async ({ taskId }: { taskId: string }): Promise<ITask> => {
  const response = await makeRequest.get(`api/tasks/public/${taskId}`);
  const task = response.data;
  return task;
};
