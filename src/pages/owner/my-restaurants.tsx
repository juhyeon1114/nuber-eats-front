import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragment";
import { myRestaurants } from "../../__generated__/myRestaurants";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);

  return (
    <div>
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      <div className="container mt-32">
        <h2 className="text-4xl font-medium mb-10">
          나의 음식점&nbsp;
          <Link to="/add-restaurant">
            <FontAwesomeIcon icon={faPlus} color="green" />
          </Link>
        </h2>
        {data?.myRestaurants.ok &&
        data?.myRestaurants.restaurants?.length === 0 ? (
          <>
            <h4 className="text-xl mb-5">You have no restaurants.</h4>
            <Link className="link" to="/add-restaurant">
              Create one &rarr;
            </Link>
          </>
        ) : (
          <div className="mt-5 grid md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.myRestaurants.restaurants?.map((restaurant) => (
              <Restaurant
                id={restaurant.id + ""}
                key={restaurant.id}
                coverImage={restaurant.coverImage}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
