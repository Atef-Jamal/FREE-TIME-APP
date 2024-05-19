import { useEffect, useState } from "react";
import { showPopup } from "../context/StateManeger";
import { makeRequest } from "../utils";
import { useAppDispatch } from "../context/Hooks";
import { TypeFrame } from "../types/frameTypes";

export const useFetchFrames = () => {
  const [frames, setFrames] = useState<TypeFrame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchMusics = async () => {
      if (error) setError(null);
      if (!loading) setLoading(true);

      try {
        const response = await makeRequest("/api/frames");
        setFrames(response.data);
      } catch (error) {
        setError("an Error occurred");
        dispatch(
          showPopup({
            status: true,
            message: "Failed to Load Frames, try again Later",
            type: "ERROR_GENERAL",
          })
        );
      } finally {
        if (loading) setLoading(false);
      }
    };

    fetchMusics();
  }, []);

  return { frames, loading, error };
};
