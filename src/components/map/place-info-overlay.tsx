import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Button } from "../button";
import {
  CreatePlaceMutation,
  CreatePlaceMutationVariables,
} from "../../__generated__/CreatePlaceMutation";
import {
  CreatePlaceUserRelationMutation,
  CreatePlaceUserRelationMutationVariables,
} from "../../__generated__/CreatePlaceUserRelationMutation";

const CREATE_PLACE_MUTATION = gql`
  mutation CreatePlaceMutation($CreatePlaceInput: CreatePlaceInput!) {
    createPlace(input: $CreatePlaceInput) {
      ok
      error
      placeId
    }
  }
`;
const CREATE_PLACE_USER_RELATION = gql`
  mutation CreatePlaceUserRelationMutation(
    $CreatePlaceUserRelationInput: CreatePlaceUserRelationInput!
  ) {
    createPlaceUserRelation(input: $CreatePlaceUserRelationInput) {
      ok
      error
    }
  }
`;

export const PlaceInfoOverlay = ({
  position,
  name,
  address,
  phone,
  url,
  categoryName,
}: any) => {
  // const onCreateMutationCompleted =({placeId}: CreatePlaceMutation)=> {
  //   createPlaceUserMutation(placeId)
  // }
  // const [
  //   createPlaceUserMutation,
  //   { data: createPlaceUserRelationData, loading, error },
  // ] = useMutation<
  //   CreatePlaceUserRelationMutation,
  //   CreatePlaceUserRelationMutationVariables
  // >(CREATE_PLACE_USER_RELATION);

  const [
    createPlaceMutation,
    {
      data: createPlaceData,
      loading: createPlaceLoading,
      error: createPlaceError,
    },
  ] = useMutation<CreatePlaceMutation, CreatePlaceMutationVariables>(
    CREATE_PLACE_MUTATION
  );

  const [isSelected, setIsSelected] = useState(false);
  const { register, handleSubmit, getValues } = useForm();
  const onClick = () => {
    setIsSelected(true);
  };
  const onSubmit = () => {
    const { lat, lng } = position;
    createPlaceMutation({
      variables: {
        CreatePlaceInput: {
          name,
          address,
          phone,
          url,
          categoryName,
          lat,
          lng,
        },
      },
    });
  };
  return (
    <div className="flex flex-col bg-gray-900 p-2 text-gray-100">
      {!isSelected && (
        <>
          <div className="flex justify-between">
            <span className="text-lg font-semibold pb-2">{name}</span>
            <button onClick={onClick}>
              {!isSelected ? (
                <FontAwesomeIcon
                  icon={farBookmark}
                  className="cursor-pointer"
                />
              ) : (
                <FontAwesomeIcon
                  icon={fasBookmark}
                  className="cursor-pointer"
                />
              )}
            </button>
          </div>
          <span>{categoryName}</span>
          <span>{address}</span>
          <span>{phone}</span>
          <a
            className="text-right cursor-pointer mt-2"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            새 창에서 상세 보기
          </a>
        </>
      )}
      {isSelected && (
        <>
          <span className="text-lg font-semibold pb-2">{name} 저장하기</span>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("memo")} type="text" placeholder="memo" />
            <Button canClick={true} loading={false} actionText={"save"} />
          </form>
        </>
      )}
    </div>
  );
};
