/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllPlacesQuery
// ====================================================

export interface GetAllPlacesQuery_getAllPlaces_places_category {
  __typename: "Category";
  name: string;
  slug: string;
  coverImg: string | null;
}

export interface GetAllPlacesQuery_getAllPlaces_places {
  __typename: "Place";
  id: number;
  kakaoPlaceId: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
  url: string | null;
  category: GetAllPlacesQuery_getAllPlaces_places_category | null;
}

export interface GetAllPlacesQuery_getAllPlaces {
  __typename: "GetAllPlacesOutput";
  places: GetAllPlacesQuery_getAllPlaces_places[] | null;
}

export interface GetAllPlacesQuery {
  getAllPlaces: GetAllPlacesQuery_getAllPlaces;
}
