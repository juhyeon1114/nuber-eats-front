import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";
import { Restaurant } from "../../components/restaurant";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { Category } from "../../components/category";
import { Pagination } from "../../components/pagination";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalItems
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();

  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
      // state: { // state는 url쿼리에 저장되지 않고, 브라우저 메모리에 저장된다. 즉, url에 노출되지 않는다
      //   searchTerm,
      // },
    });
  };

  return (
    <div>
      <Helmet>
        <title>Home | Nuber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className=" bg-gray-800 w-full py-16 flex items-center justify-center"
      >
        <input
          ref={register({ required: true, min: 3 })}
          name="searchTerm"
          type="text"
          className="input w-3/4 md:w-3/12 rounded-md border-0"
          placeholder="식당 검색하기"
        />
      </form>
      {!loading && data && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
          <div className="flex justify-around mx-auto max-w-sm">
            {data?.allCategories.categories?.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <Category
                  coverImage={category.coverImage}
                  name={category.name}
                />
              </Link>
            ))}
          </div>

          <div className="mt-5 grid md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map((restaurant) => (
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
            totalPages={data?.restaurants.totalPages}
            onNextPageClick={onNextPageClick}
            onPrevPageClick={onPrevPageClick}
          />
        </div>
      )}
    </div>
  );
};
