import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import {
  DISH_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragment";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated__/myRestaurant";
import { Dish } from "../../components/dish";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrdersParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );

  return (
    <div>
      <div
        className="  bg-gray-700  py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImage})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link
          to={`/restaurant/${id}/add-dish`}
          className=" mr-8 text-white bg-gray-800 py-3 px-10"
        >
          메뉴 추가 &rarr;
        </Link>
        <Link to={``} className=" text-white bg-green-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="text-xl mb-5">메뉴를 추가해주세요</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurant.restaurant?.menu.map((dish) => (
                <Dish
                  key={dish.id}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-5">
          <h4 className="text-center text-2xl font-medium">Sales</h4>
          <div className="mx-auto">
            <VictoryChart
              domainPadding={40}
              theme={VictoryTheme.material}
              width={window.innerWidth}
              height={400}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{ tickLabels: { fontSize: 18, angle: 45 } }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
              />
              <VictoryAxis
                style={{ tickLabels: { fontSize: 18, fill: "olive" } }}
                dependentAxis
                tickFormat={(tick) => `${tick / 1000}k`}
              />
              <VictoryLine
                // interpolation="natural"
                labels={(datum) => Math.round(datum.y)}
                labelComponent={
                  <VictoryTooltip //tooltip VS label
                    style={{ fontSize: 18 }}
                    renderInPortal
                    dy={-20}
                  />
                }
                style={{ data: { strokeWidth: 5 } }}
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};
