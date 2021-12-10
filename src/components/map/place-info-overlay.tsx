import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Button } from "../button";
import {
  GET_MY_PLACE_RELATIONS_QUERY,
  useMyPlaceRelations,
} from "../../hooks/useMyPlaceRelations";
import { client } from "../../apollo";
import { FormError } from "../form-error";
import {
  CreatePlaceUserRelationMutation,
  CreatePlaceUserRelationMutationVariables,
} from "../../__generated__/CreatePlaceUserRelationMutation";

//TO DO : gql move to /page/map ?????
//이건 컴포넌트가 아닌데 ...?!? page << map 분리 ?

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

export const PlaceInfoOverlay = ({
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

  const onCompleted = (data: CreatePlaceUserRelationMutation) => {
    //fetch data
    const {
      createPlaceUserRelation: { ok, relation },
    } = data;
    if (ok) {
      const getResult = client.readQuery({
        query: GET_MY_PLACE_RELATIONS_QUERY,
      });
      client.writeQuery({
        query: GET_MY_PLACE_RELATIONS_QUERY,
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
    { data: createMyPlaceRelationsResult, loading },
  ] = useMutation<
    CreatePlaceUserRelationMutation,
    CreatePlaceUserRelationMutationVariables
  >(CREATE_PLACE_USER_RELATION, {
    onCompleted,
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
  return (
    <div className="flex flex-col bg-gray-900 p-2 text-gray-100">
      {!isSelected && (
        <>
          <div className="flex justify-between">
            <span className="text-lg font-semibold pb-2">{name}</span>
            {isBookmarked ? (
              <FontAwesomeIcon
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
            <Button canClick={!loading} loading={loading} actionText={"save"} />
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
