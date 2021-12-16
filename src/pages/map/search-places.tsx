import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../../components/form-error";

interface ISearchPlacesProps {
  map?: kakao.maps.Map | undefined;
  setSearchPlacesResult: React.Dispatch<
    React.SetStateAction<kakao.maps.services.PlacesSearchResult | undefined>
  >;
  showSearchedPlaces: boolean;
}

export const SearchPlaces: React.FC<ISearchPlacesProps> = ({
  map,
  setSearchPlacesResult,
  showSearchedPlaces,
}) => {
  const [keyword, setKeyword] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    resetField,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();
    if (keyword) {
      resetField("search");
      ps.keywordSearch(
        keyword,
        (
          data: kakao.maps.services.PlacesSearchResult,
          status: kakao.maps.services.Status
        ) => {
          if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert("검색 결과가 존재하지 않습니다.");
            return;
          }
          if (status === kakao.maps.services.Status.ERROR) {
            alert("검색 결과 중 오류가 발생했습니다.");
            return;
          }
          if (status === kakao.maps.services.Status.OK) {
            const bounds = new kakao.maps.LatLngBounds();
            setSearchPlacesResult(data);

            data.map((item: kakao.maps.services.PlacesSearchResultItem) => {
              return bounds.extend(new kakao.maps.LatLng(+item.y, +item.x));
            });
            map.setBounds(bounds);
          }
        }
      );
    }
  }, [keyword, map, setSearchPlacesResult, resetField]);

  const onSubmit = () => {
    const keyword = getValues("search");
    setKeyword(keyword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("search", {
          required: "키워드를 입력해주세요",
        })}
        placeholder="새로운 장소 검색하기"
      />
      <button>submit</button>
      {errors.search?.message && (
        <FormError errorMessage={errors.search.message} />
      )}
      {showSearchedPlaces && <span>{`${keyword} 검색 결과`}</span>}
    </form>
  );
};
