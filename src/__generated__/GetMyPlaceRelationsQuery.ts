/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMyPlaceRelationsQuery
// ====================================================

export interface GetMyPlaceRelationsQuery_getMyPlaceRelations_relations {
  __typename: "PlaceUserRelation";
  kakaoPlaceId: number;
}

export interface GetMyPlaceRelationsQuery_getMyPlaceRelations {
  __typename: "GetMyPlaceRelationsOutput";
  ok: boolean;
  error: string | null;
  relations: GetMyPlaceRelationsQuery_getMyPlaceRelations_relations[] | null;
}

export interface GetMyPlaceRelationsQuery {
  getMyPlaceRelations: GetMyPlaceRelationsQuery_getMyPlaceRelations;
}
