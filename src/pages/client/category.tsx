import React, { useEffect, useState } from "react";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import { category, categoryVariables } from "../../__generated__/category";
import { Helmet } from "react-helmet-async";
import { Pagination } from "../../components/pagination";
import { Restaurant } from "../../components/restaurant";
import { NoResult } from "../../components/no-result";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalItems
      category {
        ...CategoryParts
      }
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const params = useParams<ICategoryParams>();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [callQuery, { loading, data }] = useLazyQuery<
    category,
    categoryVariables
  >(CATEGORY_QUERY);

  useEffect(() => {
    callQuery({
      variables: {
        input: {
          page,
          slug: params.slug,
        },
      },
    });
  }, [page, callQuery, params.slug]);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const onClickHome = () => history.push("/");

  return (
    <>
      <Helmet>
        <title>Category | Nuber Eats</title>
      </Helmet>
      {!loading && data && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
          <div className="grid grid-cols-2">
            <h1 className="text-4xl">카테고리 : {params?.slug}</h1>
            <div className="text-right">
              <button
                className="bg-blue-500 px-4 py-2 rounded-full text-white focus:outline-none"
                onClick={onClickHome}
              >
                &larr;&nbsp;뒤로가기
              </button>
            </div>
          </div>

          {!data?.category.results?.length ? (
            <NoResult />
          ) : (
            <>
              <div className="mt-5 grid md:grid-cols-3 gap-x-5 gap-y-10">
                {data?.category.results?.map((restaurant) => (
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
                totalPages={data?.category.totalPages}
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
