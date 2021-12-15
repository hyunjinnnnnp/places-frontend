/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EditMemoInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: EditMemo
// ====================================================

export interface EditMemo_editMemo {
  __typename: "EditMemoOutput";
  ok: boolean;
  error: string | null;
  relationId: number | null;
}

export interface EditMemo {
  editMemo: EditMemo_editMemo;
}

export interface EditMemoVariables {
  editMemoInput: EditMemoInput;
}
