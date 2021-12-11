import { gql, useQuery } from "@apollo/client";
import { GetMyPlaceRelations } from "../__generated__/GetMyPlaceRelations";

export const GET_MY_PLACE_RELATIONS = gql`
  query GetMyPlaceRelations {
    getMyPlaceRelations {
      ok
      error
      relations {
        place {
          name
          address
          lat
          lng
          phone
          url
          # category {
          #   categoryName
          # }
        }
        kakaoPlaceId
        memo
        isLiked
        isVisited
      }
    }
  }
`;
export const useMyPlaceRelations = () => {
  return useQuery<GetMyPlaceRelations>(GET_MY_PLACE_RELATIONS);
};
