/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreatePlaceInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreatePlaceMutation
// ====================================================

export interface CreatePlaceMutation_createPlace {
  __typename: "CreatePlaceOutput";
  ok: boolean;
  error: string | null;
  placeId: number | null;
}

export interface CreatePlaceMutation {
  createPlace: CreatePlaceMutation_createPlace;
}

export interface CreatePlaceMutationVariables {
  CreatePlaceInput: CreatePlaceInput;
}
