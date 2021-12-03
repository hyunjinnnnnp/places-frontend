import { gql, useQuery } from "@apollo/client";
import { myProfileMutation } from "../__generated__/myProfileMutation";

const MY_PROFILE_QUERY = gql`
  query myProfileMutation {
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
  return useQuery<myProfileMutation>(MY_PROFILE_QUERY);
};
