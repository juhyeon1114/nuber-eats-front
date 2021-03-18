import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import {
  restaurant,
  restaurantVariables,
} from "../../__generated__/restaurant";
import { Dish } from "../../components/dish";
import { CreateOrderIteminput } from "../../__generated__/globalTypes";

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IRestaurantParams {
  id: string;
}

export const Restaurant = () => {
  const params = useParams<IRestaurantParams>();
  const { data } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
    variables: { input: { restaurantId: +params.id } },
  });
  const [orderItems, setOrderItems] = useState<CreateOrderIteminput[]>([]);
  const [orderStarted, setOrderStarted] = useState(false);
  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };
  const startOrderToggle = () => {
    setOrderStarted((current) => !current);
  };
  const selecItemToggle = (dishId: number): void => {
    if (isSelected(dishId)) {
      setOrderItems((current) => current.filter((c) => c.dishId !== dishId));
    } else {
      setOrderItems((current) => [{ dishId, options: [] }, ...current]);
    }
  };
  const addOptionToItem = (dishId: number, option: any) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      setOrderItems((current) => current.filter((c) => c.dishId !== dishId));
      setOrderItems((current) => [
        { dishId, options: [option, ...oldItem.options!] },
        ...current,
      ]);
    }
  };

  return (
    <div>
      <div
        className="bg-gray-800 py-32 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImage})`,
        }}
      >
        <div className="bg-white w-3/12 py-8 pl-48">
          <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-2">
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>

      <div className="container pb-32 mt-20 flex flex-col items-end">
        <button onClick={startOrderToggle} className="btn">
          {orderStarted ? "주문중" : "주문시작"}
        </button>
        <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {data?.restaurant.restaurant?.menu.map((dish) => (
            <Dish
              key={dish.id}
              id={dish.id}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              isCustomer={true}
              options={dish.options}
              orderStarted={orderStarted}
              selecItemToggle={selecItemToggle}
              isSelected={isSelected(dish.id)}
              addOptionToItem={addOptionToItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
