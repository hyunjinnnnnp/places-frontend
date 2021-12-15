/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface CreateAccountInput {
  email: string;
  nickname: string;
  password: string;
  avatarUrl?: string | null;
}

export interface CreatePlaceUserRelationInput {
  kakaoPlaceId: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string | null;
  url?: string | null;
  categoryName?: string | null;
  memo?: string | null;
}

export interface DeletePlaceUserRelationInput {
  kakaoPlaceId: number;
}

export interface EditIsLikedInput {
  isLiked: boolean;
  kakaoPlaceId: number;
}

export interface EditIsVisitedInput {
  isVisited: boolean;
  kakaoPlaceId: number;
}

export interface EditMemoInput {
  memo?: string | null;
  kakaoPlaceId: number;
}

export interface EditProfileInput {
  email?: string | null;
  nickname?: string | null;
  avatarUrl?: string | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyEmailInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
