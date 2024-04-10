import { avatar } from "../../assets";
import { User } from "../../types";

interface TypeProps {
  user: User | null;
}

const UserImage = ({ user }: TypeProps) => {
  return (
    <>
      {user?.profilePicture ? (
        <div className={`relative w-full h-full rounded-sm `}>
          {user.activeFrame ? (
            <img
              className=" absolute top-0 w-full h-full rounded-sm"
              src={user.activeFrame.image}
              alt="frame"
            />
          ) : undefined}
          <img
            className={`absolute transition-all ${
              user.activeFrame
                ? "top-[15%] left-[14%] w-[70%] h-[70%] rounded-sm"
                : "w-full h-full rounded-md "
            } `}
            src={user.profilePicture}
            alt="user img"
          />
        </div>
      ) : (
        <div className={`relative w-full h-full rounded-sm transition-all`}>
          {user?.activeFrame ? (
            <img
              className=" absolute top-0 w-full h-full rounded-md"
              src={user.activeFrame.image}
              alt="frame"
            />
          ) : undefined}
          <img
            className={`absolute transition-all  ${
              user?.activeFrame
                ? "top-[15%] left-[14%] w-[70%] h-[70%] rounded-sm"
                : "w-full h-full rounded-md "
            } `}
            src={avatar}
            alt="avatar"
          />
        </div>
      )}
    </>
  );
};
// const UserImage = ({ user, className }: TypeProps) => {
//   return (
//     <>
//       {user?.profilePicture ? (
//         <div
//           className={`relative w-[40px] h-[35px] sm:w-[30px] sm:h-[25px] rounded-sm ${className} `}
//         >
//           {user.activeFrame ? (
//             <img
//               className=" absolute top-0 w-full h-full rounded-sm"
//               src={user.activeFrame.image}
//               alt="frame"
//             />
//           ) : undefined}
//           <img
//             className={`absolute transition-all ${
//               user.activeFrame
//                 ? "top-[15%] left-[14%] w-[70%] h-[70%] rounded-sm"
//                 : "w-full h-full rounded-md "
//             } `}
//             src={user.profilePicture}
//             alt="user img"
//           />
//         </div>
//       ) : (
//         <div
//           className={`relative w-[40px] sm:w-[30px] h-[35px] sm:h-[25px] rounded-sm transition-all ${className}`}
//         >
//           {user?.activeFrame ? (
//             <img
//               className=" absolute top-0 w-full h-full rounded-md"
//               src={user.activeFrame.image}
//               alt="frame"
//             />
//           ) : undefined}
//           <img
//             className={`absolute transition-all  ${
//               user?.activeFrame
//                 ? "top-[15%] left-[14%] w-[70%] h-[70%] rounded-sm"
//                 : "w-full h-full rounded-md "
//             } `}
//             src={avatar}
//             alt="avatar"
//           />
//         </div>
//       )}
//     </>
//   );
// };

export default UserImage;
