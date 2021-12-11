/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllPlaces
// ====================================================

export interface GetAllPlaces_getAllPlaces_places {
  __typename: "Place";
  kakaoPlaceId: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  url: string | null;
}

export interface GetAllPlaces_getAllPlaces {
  __typename: "GetAllPlacesOutput";
  places: GetAllPlaces_getAllPlaces_places[] | null;
}

export interface GetAllPlaces {
  getAllPlaces: GetAllPlaces_getAllPlaces;
}
