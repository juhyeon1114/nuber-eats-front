import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImage
        slug
        restaurantsCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalItems
      results {
        id
        name
        coverImage
        category {
          id
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Restaurants = () => {
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page: 1,
      },
    },
  });

  return (
    <div>
      <Helmet>
        <title>Restaurants | Nuber Eats</title>
      </Helmet>
      <form className=" bg-gray-800 w-full py-16 flex items-center justify-center">
        <input
          type="text"
          className="input w-3/12 rounded-md border-0"
          placeholder="식당 검색하기"
        />
      </form>
      {!loading && data && (
        <div className="max-w-screen-2xl mx-auto mt-8">
          <div className="flex justify-around mx-auto max-w-sm">
            {data?.allCategories.categories?.map((category) => (
              <div className="flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded-full bg-cover cursor-pointer"
                  style={{ backgroundImage: `url(${category.coverImage})` }}
                ></div>
                <span className="text-sm text-center font-medium mt-1">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div></div>
    </div>
  );
};
