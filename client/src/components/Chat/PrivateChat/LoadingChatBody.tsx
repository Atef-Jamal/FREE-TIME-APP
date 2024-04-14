import { Suspense, lazy } from "react";

const Skeleton = lazy(() => import("../../Others/Skeleton"));

const LoadingChatBody = () => {
  return (
    <div className="w-full h-full flex flex-col items-center gap-2 pb-3">
      <div className="flex  gap-2 w-full justify-center bg-[#1f1f2e9a] py-2 border border-gray-700">
        <Suspense>
          <Skeleton className="w-10 h-10 " />
        </Suspense>
        <div className="mt-2">
          <Suspense>
            <Skeleton className="w-[150px] h-2 mb-1" />
          </Suspense>
          <Suspense>
            <Skeleton className="w-[90px] h-2" />
          </Suspense>
        </div>
      </div>
      <div className="flex flex-col items-center w-full h-[100%] gap-2 overflow-scroll scrollbar-none p-1 pb-2 ">
        {[...Array(5).keys()].map((ele) => (
          <div
            key={ele}
            className="bg-[#0b0b226c] w-full rounded-lg p-2 flex flex-col gap-1"
          >
            <div className="flex gap-2">
              <Suspense>
                <Skeleton className="w-9 h-9" />
              </Suspense>
              <div className="mt-1">
                <Suspense>
                  <Skeleton className="w-[150px] h-2 mb-[6px] rounded-sm" />
                </Suspense>
                <Suspense>
                  <Skeleton className="w-[150px] h-2 rounded-sm" />
                </Suspense>
              </div>
            </div>
            <>
              <Suspense>
                <Skeleton className="w-[85%] h-2 mb-1" />
              </Suspense>
              <Suspense>
                <Skeleton className="w-[70%] h-2" />
              </Suspense>
            </>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingChatBody;
