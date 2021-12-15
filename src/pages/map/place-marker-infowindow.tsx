import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as fasBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faCheckCircle as fasCheck } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle as farCheck } from "@fortawesome/free-regular-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import {
  GET_MY_PLACE_RELATIONS,
  useMyPlaceRelations,
} from "../../hooks/useMyPlaceRelations";
import { client } from "../../apollo";
import { FormError } from "../../components/form-error";
import { Button } from "../../components/button";
import {
  DeletePlaceUserRelation,
  DeletePlaceUserRelationVariables,
} from "../../__generated__/DeletePlaceUserRelation";
import { GetMyPlaceRelations_getMyPlaceRelations_relations } from "../../__generated__/GetMyPlaceRelations";
import {
  CreatePlaceUserRelationMutation,
  CreatePlaceUserRelationMutationVariables,
} from "../../__generated__/CreatePlaceUserRelationMutation";
import {
  EditIsLikedMutation,
  EditIsLikedMutationVariables,
} from "../../__generated__/EditIsLikedMutation";
import {
  EditIsVisitedMutation,
  EditIsVisitedMutationVariables,
} from "../../__generated__/EditIsVisitedMutation";
import { EditMemo, EditMemoVariables } from "../../__generated__/EditMemo";

const CREATE_PLACE_USER_RELATION = gql`
  mutation CreatePlaceUserRelationMutation(
    $CreatePlaceUserRelationInput: CreatePlaceUserRelationInput!
  ) {
    createPlaceUserRelation(input: $CreatePlaceUserRelationInput) {
      ok
      error
      relation {
        id
        placeId
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

const EDIT_IS_LIKED_MUTATION = gql`
  mutation EditIsLikedMutation($editIsLikedInput: EditIsLikedInput!) {
    editIsLiked(input: $editIsLikedInput) {
      ok
      error
      relationId
    }
  }
`;

const EDIT_IS_VISITED_MUTATION = gql`
  mutation EditIsVisitedMutation($editIsVisitedInput: EditIsVisitedInput!) {
    editIsVisited(input: $editIsVisitedInput) {
      ok
      error
      relationId
    }
  }
`;

const EDIT_MEMO_MUTATION = gql`
  mutation EditMemo($editMemoInput: EditMemoInput!) {
    editMemo(input: $editMemoInput) {
      ok
      error
      relationId
    }
  }
`;

interface IPlaceMarkerInfoWindowProps {
  placeId?: number;
  position: { lat: number; lng: number };
  name: string;
  address: string;
  phone: string | null;
  url: string | null;
  categoryName?: string;
  kakaoPlaceId: number;
}

export const PlaceMarkerInfoWindow: React.FC<IPlaceMarkerInfoWindowProps> = ({
  position,
  name,
  address,
  phone,
  url,
  categoryName,
  placeId,
  kakaoPlaceId,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isVisited, setIsVisited] = useState(false);
  const [memo, setMemo] = useState<string | null>();
  const [isMemoEditing, setIsMemoEditing] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const { lat, lng } = position;

  //fetch data
  const onCreateCompleted = (data: CreatePlaceUserRelationMutation) => {
    const {
      createPlaceUserRelation: { ok, relation },
    } = data;
    const { memo } = getValues();
    if (ok) {
      const getResult = client.readQuery({
        query: GET_MY_PLACE_RELATIONS,
      });
      client.writeQuery({
        query: GET_MY_PLACE_RELATIONS,
        data: {
          getMyPlaceRelations: {
            __typename: "GetMyPlaceRelationsOutput",
            ok: true,
            error: null,
            relations: [
              ...getResult.getMyPlaceRelations.relations,
              {
                place: {
                  __typename: "Place",
                  id: relation?.placeId,
                  name,
                  address,
                  lat,
                  lng,
                  phone,
                  url,
                },
                __typename: "PlaceUserRelation",
                id: relation?.id,
                kakaoPlaceId: relation?.kakaoPlaceId,
                memo,
                isLiked: false,
                isVisited: false,
              },
            ],
          },
        },
      });
      setIsSelected(false);
      setIsBookmarked(true);
      setIsCreated(true);
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

  //myPlaceRelations에 저장된 장소라면 setIsBookmark, setIsLiked, setIsVisited
  useEffect(() => {
    const isStoredPlace =
      myPlaceRelationsResult?.getMyPlaceRelations.relations?.find(
        (relation) => {
          return relation.kakaoPlaceId === kakaoPlaceId;
        }
      );
    if (isStoredPlace) {
      setIsLiked(isStoredPlace.isLiked);
      setIsVisited(isStoredPlace.isVisited);
      setMemo(isStoredPlace.memo);
      return setIsBookmarked(true);
    } else {
      return setIsBookmarked(false);
    }
  }, [
    kakaoPlaceId,
    myPlaceRelationsResult?.getMyPlaceRelations.relations,
    isCreated,
  ]);

  const onSubmit = () => {
    const { memo } = getValues();
    createPlaceUserRelationMutation({
      variables: {
        CreatePlaceUserRelationInput: {
          kakaoPlaceId,
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
      const getResult = client.readQuery({ query: GET_MY_PLACE_RELATIONS });
      const filteredRelations = getResult.getMyPlaceRelations.relations.filter(
        (relation: GetMyPlaceRelations_getMyPlaceRelations_relations) =>
          relation.place.id !== placeId
      );
      client.writeQuery({
        query: GET_MY_PLACE_RELATIONS,
        data: {
          getMyPlaceRelations: {
            __typename: "GetMyPlaceRelationsOutput",
            ok: true,
            error: null,
            relations: filteredRelations,
          },
        },
      });
      setIsBookmarked(false);
    }
  };

  const [deletePlaceUserRelation] = useMutation<
    DeletePlaceUserRelation,
    DeletePlaceUserRelationVariables
  >(DELETE_PLACE_USER_RELATION, { onCompleted: onDeleteCompleted });

  const onDelete = (kakaoPlaceId: number) => {
    deletePlaceUserRelation({
      variables: {
        DeletePlaceUserRelationInput: {
          kakaoPlaceId,
        },
      },
    });
  };
  const onEditIsLikedCompleted = (data: EditIsLikedMutation) => {
    const {
      editIsLiked: { ok, relationId },
    } = data;
    if (ok) {
      const queryResult = client.readFragment({
        id: `PlaceUserRelation:${relationId}`,
        fragment: gql`
          fragment editIsLiked on PlaceUserRelation {
            isLiked
          }
        `,
      });
      client.writeFragment({
        id: `PlaceUserRelation:${relationId}`,
        fragment: gql`
          fragment editIsLiked on PlaceUserRelation {
            isLiked
          }
        `,
        data: {
          isLiked: !queryResult.isLiked,
        },
      });
    }
  };
  const [editIsLikedMutation] = useMutation<
    EditIsLikedMutation,
    EditIsLikedMutationVariables
  >(EDIT_IS_LIKED_MUTATION, { onCompleted: onEditIsLikedCompleted });

  const editIsLiked = (isLiked: boolean, kakaoPlaceId: number) => {
    editIsLikedMutation({
      variables: {
        editIsLikedInput: {
          kakaoPlaceId,
          isLiked: !isLiked,
        },
      },
    });
  };

  const onEditIsVisitedComplete = (data: EditIsVisitedMutation) => {
    const {
      editIsVisited: { ok, relationId },
    } = data;
    if (ok) {
      const queryResult = client.readFragment({
        id: `PlaceUserRelation:${relationId}`,
        fragment: gql`
          fragment editIsVisited on PlaceUserRelation {
            isVisited
          }
        `,
      });
      client.writeFragment({
        id: `PlaceUserRelation:${relationId}`,
        fragment: gql`
          fragment editIsVisited on PlaceUserRelation {
            isVisited
          }
        `,
        data: {
          isVisited: !queryResult.isVisited,
        },
      });
    }
  };

  const [editIsVisitedMutation] = useMutation<
    EditIsVisitedMutation,
    EditIsVisitedMutationVariables
  >(EDIT_IS_VISITED_MUTATION, { onCompleted: onEditIsVisitedComplete });

  const editIsVisited = (isVisited: boolean, kakaoPlaceId: number) => {
    editIsVisitedMutation({
      variables: {
        editIsVisitedInput: {
          kakaoPlaceId,
          isVisited: !isVisited,
        },
      },
    });
  };

  const onEditMemoCompleted = (data: EditMemo) => {
    const {
      editMemo: { ok, relationId },
    } = data;
    const { editedMemo } = getValues();
    client.writeFragment({
      id: `PlaceUserRelation:${relationId}`,
      fragment: gql`
        fragment editedMemo on PlaceUserRelation {
          memo
        }
      `,
      data: {
        memo: editedMemo,
      },
    });
  };

  const onEditMemo = () => {
    const { editedMemo } = getValues();
    editMemoMutation({
      variables: {
        editMemoInput: {
          kakaoPlaceId,
          memo: editedMemo,
        },
      },
    });
    setIsMemoEditing(false);
  };

  const [editMemoMutation] = useMutation<EditMemo, EditMemoVariables>(
    EDIT_MEMO_MUTATION,
    {
      onCompleted: onEditMemoCompleted,
    }
  );

  return (
    <div className="flex flex-col bg-gray-900 p-2 text-gray-100">
      {!isSelected && (
        <>
          <div className="flex justify-between">
            <span className="text-lg font-semibold pb-2">{name}</span>
            <button
              onClick={() => {
                editIsLiked(isLiked, kakaoPlaceId);
                setIsLiked(!isLiked);
              }}
            >
              {isBookmarked && isLiked && (
                <FontAwesomeIcon
                  icon={fasHeart}
                  className="cursor-pointer text-red-400"
                />
              )}
              {isBookmarked && !isLiked && (
                <FontAwesomeIcon
                  icon={farHeart}
                  className="cursor-pointer text-red-400"
                />
              )}
            </button>
            <button
              onClick={() => {
                editIsVisited(isVisited, kakaoPlaceId);
                setIsVisited(!isVisited);
              }}
            >
              {isBookmarked && isVisited && (
                <FontAwesomeIcon
                  icon={fasCheck}
                  className="cursor-pointer text-blue-600"
                />
              )}
              {isBookmarked && !isVisited && (
                <FontAwesomeIcon
                  icon={farCheck}
                  className="cursor-pointer text-blue-600"
                />
              )}
            </button>
            {isBookmarked ? (
              <FontAwesomeIcon
                onClick={() => {
                  setIsBookmarked(!isBookmarked);
                  onDelete(kakaoPlaceId);
                }}
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
          <div>
            {isBookmarked && memo && !isMemoEditing && (
              <>
                <span>{isBookmarked && memo && memo}</span>
                <button onClick={() => setIsMemoEditing(true)}>
                  {isBookmarked && memo && <FontAwesomeIcon icon={faEdit} />}
                </button>
              </>
            )}
            {isBookmarked && memo && isMemoEditing && (
              <form onSubmit={handleSubmit(onEditMemo)}>
                <input
                  {...register("editedMemo")}
                  type="text"
                  placeholder="memo"
                  defaultValue={memo}
                />
                <Button
                  canClick={!creating}
                  loading={creating}
                  actionText={"edit"}
                />
              </form>
            )}
          </div>
          {url && (
            <a
              className="text-right cursor-pointer mt-2"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              새 창에서 상세 보기
            </a>
          )}
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
