/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMyPlaceRelations
// ====================================================

export interface GetMyPlaceRelations_getMyPlaceRelations_relations_place {
  __typename: "Place";
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  url: string | null;
}

export interface GetMyPlaceRelations_getMyPlaceRelations_relations {
  __typename: "PlaceUserRelation";
  place: GetMyPlaceRelations_getMyPlaceRelations_relations_place;
  kakaoPlaceId: number;
  memo: string | null;
  isLiked: boolean;
  isVisited: boolean;
}

export interface GetMyPlaceRelations_getMyPlaceRelations {
  __typename: "GetMyPlaceRelationsOutput";
  ok: boolean;
  error: string | null;
  relations: GetMyPlaceRelations_getMyPlaceRelations_relations[] | null;
}

export interface GetMyPlaceRelations {
  getMyPlaceRelations: GetMyPlaceRelations_getMyPlaceRelations;
}
