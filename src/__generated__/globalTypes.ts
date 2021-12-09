/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface CategoryInputType {
  name: string;
  coverImg?: string | null;
  slug: string;
  places?: PlacesInputType[] | null;
}

export interface CreateAccountInput {
  email: string;
  nickname: string;
  password: string;
  avatarUrl?: string | null;
}

export interface CreatePlaceInput {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string | null;
  url?: string | null;
  category?: CategoryInputType | null;
  categoryName?: string | null;
}

export interface CreatePlaceUserRelationInput {
  placeId: number;
  memo?: string | null;
}

export interface EditProfileInput {
  email?: string | null;
  nickname?: string | null;
  avatarUrl?: string | null;
}

export interface FollowInputType {
  following: UserInputType;
  followingId: number;
  follower: UserInputType;
  followerId: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface PlaceUserRelationInputType {
  id: number;
  place: PlacesInputType;
  placeId: number;
  user: UserInputType;
  userId: number;
  memo?: string | null;
  isLiked: boolean;
  isVisited: boolean;
}

export interface PlacesInputType {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string | null;
  url?: string | null;
  relations?: PlaceUserRelationInputType[] | null;
  category?: CategoryInputType | null;
  categoryId?: number | null;
  suggestions?: SuggestionInputType[] | null;
}

export interface SuggestionInputType {
  place?: PlacesInputType | null;
  message: string;
  receiver: UserInputType;
  sender: UserInputType;
  placeId?: number | null;
  receiverId: number;
  senderId: number;
}

export interface UserInputType {
  email: string;
  nickname: string;
  password: string;
  avatarUrl?: string | null;
  verified: boolean;
  relations?: PlaceUserRelationInputType[] | null;
  following?: FollowInputType[] | null;
  followers?: FollowInputType[] | null;
}

export interface VerifyEmailInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
