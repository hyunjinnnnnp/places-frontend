/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: myProfile
// ====================================================

export interface myProfile_myProfile_user {
  __typename: "User";
  id: number;
  email: string;
  nickname: string;
  verified: boolean;
  avatarUrl: string | null;
}

export interface myProfile_myProfile {
  __typename: "MyProfileOutput";
  user: myProfile_myProfile_user | null;
  followingCount: number | null;
  followersCount: number | null;
  relationsCount: number | null;
}

export interface myProfile {
  myProfile: myProfile_myProfile;
}
