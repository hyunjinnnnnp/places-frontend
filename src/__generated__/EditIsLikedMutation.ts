/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditIsLikedInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: EditIsLikedMutation
// ====================================================

export interface EditIsLikedMutation_editIsLiked {
  __typename: "EditIsLikedOutput";
  ok: boolean;
  error: string | null;
  relationId: number | null;
}

export interface EditIsLikedMutation {
  editIsLiked: EditIsLikedMutation_editIsLiked;
}

export interface EditIsLikedMutationVariables {
  editIsLikedInput: EditIsLikedInput;
}
