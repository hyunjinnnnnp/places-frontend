/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreatePlaceUserRelationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreatePlaceUserRelationMutation
// ====================================================

export interface CreatePlaceUserRelationMutation_createPlaceUserRelation_relation {
  __typename: "PlaceUserRelation";
  id: number;
  placeId: number;
  kakaoPlaceId: number;
}

export interface CreatePlaceUserRelationMutation_createPlaceUserRelation {
  __typename: "CreatePlaceUserRelationOutput";
  ok: boolean;
  error: string | null;
  relation: CreatePlaceUserRelationMutation_createPlaceUserRelation_relation | null;
}

export interface CreatePlaceUserRelationMutation {
  createPlaceUserRelation: CreatePlaceUserRelationMutation_createPlaceUserRelation;
}

export interface CreatePlaceUserRelationMutationVariables {
  CreatePlaceUserRelationInput: CreatePlaceUserRelationInput;
}
