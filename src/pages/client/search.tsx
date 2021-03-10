import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useHistory } from "react-router-dom";
import { NoResult } from "../../components/no-result";
import { Pagination } from "../../components/pagination";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import {
  searchRestaurant,
  searchRestaurantVariables,
} from "../../__generated__/searchRestaurant";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalItems
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const [query, setQuery] = useState("");
  const location = useLocation();
  const history = useHistory();
  const [page, setPage] = useState(1);

  const [callQuery, { loading, data }] = useLazyQuery<
    searchRestaurant,
    searchRestaurantVariables
  >(SEARCH_RESTAURANT);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const onClickHome = () => history.push("/");

  useEffect(() => {
    const [_, query] = location.search.split("?term=");

    if (!query) return history.replace("/");

    setQuery(() => query);
    callQuery({
      variables: {
        input: {
          page,
          query,
        },
      },
    });
  }, [history, location, page, callQuery]);

  return (
    <>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      {!loading && data && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
          <div className="grid grid-cols-2">
            <h1 className="text-4xl">"{query}"에 대한 검색결과</h1>
            <div className="text-right">
              <button
                className="bg-blue-500 px-4 py-2 rounded-full text-white focus:outline-none"
                onClick={onClickHome}
              >
                &larr;&nbsp;뒤로가기
              </button>
            </div>
          </div>

          {!data?.searchRestaurant.restaurants?.length ? (
            <NoResult />
          ) : (
            <>
              <div className="mt-5 grid md:grid-cols-3 gap-x-5 gap-y-10">
                {data?.searchRestaurant.restaurants?.map((restaurant) => (
                  <Restaurant
                    id={restaurant.id + ""}
                    key={restaurant.id}
                    coverImage={restaurant.coverImage}
                    name={restaurant.name}
                    categoryName={restaurant.category?.name}
                  />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={data?.searchRestaurant.totalPages}
                onNextPageClick={onNextPageClick}
                onPrevPageClick={onPrevPageClick}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};
