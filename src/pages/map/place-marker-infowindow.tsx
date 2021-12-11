import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import {
  GET_MY_PLACE_RELATIONS,
  useMyPlaceRelations,
} from "../../hooks/useMyPlaceRelations";
import { client } from "../../apollo";
import {
  CreatePlaceUserRelationMutation,
  CreatePlaceUserRelationMutationVariables,
} from "../../__generated__/CreatePlaceUserRelationMutation";
import { FormError } from "../../components/form-error";
import { Button } from "../../components/button";
import {
  DeletePlaceUserRelation,
  DeletePlaceUserRelationVariables,
} from "../../__generated__/DeletePlaceUserRelation";

const CREATE_PLACE_USER_RELATION = gql`
  mutation CreatePlaceUserRelationMutation(
    $CreatePlaceUserRelationInput: CreatePlaceUserRelationInput!
  ) {
    createPlaceUserRelation(input: $CreatePlaceUserRelationInput) {
      ok
      error
      relation {
        kakaoPlaceId
      }
    }
  }
`;

const DELETE_PLACE_USER_RELATION = gql`
  mutation DeletePlaceUserRelation(
    $DeletePlaceUserRelationInput: DeletePlaceUserRelationInput!
  ) {
    deletePlaceUserRelation(input: $DeletePlaceUserRelationInput) {
      ok
      error
    }
  }
`;

export const PlaceMarkerInfoWindow = ({
  position,
  name,
  address,
  phone,
  url,
  categoryName,
  kakaoPlaceId,
}: any) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const onCreateCompleted = (data: CreatePlaceUserRelationMutation) => {
    //fetch data
    const {
      createPlaceUserRelation: { ok, relation },
    } = data;
    if (ok) {
      const getResult = client.readQuery({
        query: GET_MY_PLACE_RELATIONS,
      });
      client.writeQuery({
        query: GET_MY_PLACE_RELATIONS,
        data: {
          getMyPlaceRelations: {
            ok: true,
            error: null,
            relations: [
              ...getResult.getMyPlaceRelations.relations,
              {
                __typename: "PlaceUserRelation",
                kakaoPlaceId: relation?.kakaoPlaceId,
              },
            ],
          },
        },
      });
      setIsSelected(false);
      setIsCompleted(true);
    }
  };
  const [
    createPlaceUserRelationMutation,
    { data: createMyPlaceRelationsResult, loading: creating },
  ] = useMutation<
    CreatePlaceUserRelationMutation,
    CreatePlaceUserRelationMutationVariables
  >(CREATE_PLACE_USER_RELATION, {
    onCompleted: onCreateCompleted,
  });
  const { register, handleSubmit, getValues } = useForm();

  const { data: myPlaceRelationsResult } = useMyPlaceRelations();
  useEffect(() => {
    const isStoredPlace =
      myPlaceRelationsResult?.getMyPlaceRelations.relations?.filter(
        (relation) => {
          return relation.kakaoPlaceId === +kakaoPlaceId;
        }
      );
    if (isStoredPlace && isStoredPlace.length !== 0) {
      return setIsBookmarked(true);
    } else {
      return setIsBookmarked(false);
    }
  }, [
    kakaoPlaceId,
    myPlaceRelationsResult?.getMyPlaceRelations.relations,
    isCompleted,
  ]);

  const onSubmit = () => {
    const { lat, lng } = position;
    const { memo } = getValues();
    createPlaceUserRelationMutation({
      variables: {
        CreatePlaceUserRelationInput: {
          kakaoPlaceId: +kakaoPlaceId,
          name,
          address,
          phone,
          url,
          categoryName,
          lat,
          lng,
          memo,
        },
      },
    });
  };
  const onDeleteCompleted = (data: DeletePlaceUserRelation) => {
    const {
      deletePlaceUserRelation: { ok },
    } = data;
    if (ok) {
      console.log("ok");
      //write query
    }
  };

  const [deletePlaceUserRelation] = useMutation<
    DeletePlaceUserRelation,
    DeletePlaceUserRelationVariables
  >(DELETE_PLACE_USER_RELATION, { onCompleted: onDeleteCompleted });
  const deleteMyPlaceRelation = (kakaoPlaceId: number) => {
    deletePlaceUserRelation({
      variables: {
        DeletePlaceUserRelationInput: {
          kakaoPlaceId,
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
            {isBookmarked ? (
              <FontAwesomeIcon
                onClick={() => deleteMyPlaceRelation(+kakaoPlaceId)}
                icon={fasBookmark}
                className="cursor-pointer text-yellow-400"
              />
            ) : (
              <FontAwesomeIcon
                onClick={() => setIsSelected(true)}
                icon={farBookmark}
                className="cursor-pointer"
              />
            )}
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
            <Button
              canClick={!creating}
              loading={creating}
              actionText={"save"}
            />
          </form>
          {createMyPlaceRelationsResult?.createPlaceUserRelation.error && (
            <FormError
              errorMessage={
                createMyPlaceRelationsResult.createPlaceUserRelation.error
              }
            />
          )}
        </>
      )}
    </div>
  );
};
