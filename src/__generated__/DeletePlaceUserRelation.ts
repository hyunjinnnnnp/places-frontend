/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DeletePlaceUserRelationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeletePlaceUserRelation
// ====================================================

export interface DeletePlaceUserRelation_deletePlaceUserRelation {
  __typename: "DeletePlaceUserRelationOutput";
  ok: boolean;
  error: string | null;
}

export interface DeletePlaceUserRelation {
  deletePlaceUserRelation: DeletePlaceUserRelation_deletePlaceUserRelation;
}

export interface DeletePlaceUserRelationVariables {
  DeletePlaceUserRelationInput: DeletePlaceUserRelationInput;
}
