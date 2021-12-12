/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllPlacesQuery
// ====================================================

export interface GetAllPlacesQuery_getAllPlaces_places {
  __typename: "Place";
  kakaoPlaceId: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  url: string | null;
}

export interface GetAllPlacesQuery_getAllPlaces {
  __typename: "GetAllPlacesOutput";
  places: GetAllPlacesQuery_getAllPlaces_places[] | null;
}

export interface GetAllPlacesQuery {
  getAllPlaces: GetAllPlacesQuery_getAllPlaces;
}
