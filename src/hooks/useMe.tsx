import { gql, useQuery } from "@apollo/client";
import { MyProfileQuery } from "../__generated__/MyProfileQuery";

const MY_PROFILE_QUERY = gql`
  query MyProfileQuery {
    myProfile {
      user {
        id
        email
        nickname
        verified
        avatarUrl
      }
      followingCount
      followersCount
      relationsCount
    }
  }
`;

export const useMe = () => {
  return useQuery<MyProfileQuery>(MY_PROFILE_QUERY);
};
