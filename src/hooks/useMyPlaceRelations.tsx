import { gql, useQuery } from "@apollo/client";
import { GetMyPlaceRelationsQuery } from "../__generated__/GetMyPlaceRelationsQuery";

export const GET_MY_PLACE_RELATIONS_QUERY = gql`
  query GetMyPlaceRelationsQuery {
    getMyPlaceRelations {
      ok
      error
      relations {
        kakaoPlaceId
      }
    }
  }
`;

export const useMyPlaceRelations = () => {
  return useQuery<GetMyPlaceRelationsQuery>(GET_MY_PLACE_RELATIONS_QUERY);
};
