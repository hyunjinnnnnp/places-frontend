/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyProfileQuery
// ====================================================

export interface MyProfileQuery_myProfile_user {
  __typename: "User";
  id: number;
  email: string;
  nickname: string;
  verified: boolean;
  avatarUrl: string | null;
}

export interface MyProfileQuery_myProfile {
  __typename: "MyProfileOutput";
  user: MyProfileQuery_myProfile_user | null;
  followingCount: number | null;
  followersCount: number | null;
  relationsCount: number | null;
}

export interface MyProfileQuery {
  myProfile: MyProfileQuery_myProfile;
}
