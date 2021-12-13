/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditPlaceUserRelationInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: EditPlaceUserRelation
// ====================================================

export interface EditPlaceUserRelation_editPlaceUserRelation {
  __typename: "EditPlaceUserRelationOutput";
  ok: boolean;
  error: string | null;
}

export interface EditPlaceUserRelation {
  editPlaceUserRelation: EditPlaceUserRelation_editPlaceUserRelation;
}

export interface EditPlaceUserRelationVariables {
  EditPlaceUserRelationInput: EditPlaceUserRelationInput;
}
