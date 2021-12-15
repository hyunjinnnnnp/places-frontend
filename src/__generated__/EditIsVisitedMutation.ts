/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditIsVisitedInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: EditIsVisitedMutation
// ====================================================

export interface EditIsVisitedMutation_editIsVisited {
  __typename: "EditIsVisitedOutput";
  ok: boolean;
  error: string | null;
  relationId: number | null;
}

export interface EditIsVisitedMutation {
  editIsVisited: EditIsVisitedMutation_editIsVisited;
}

export interface EditIsVisitedMutationVariables {
  editIsVisitedInput: EditIsVisitedInput;
}
