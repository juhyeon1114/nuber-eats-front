import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useHistory, useParams } from "react-router";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragment";
import {
  restaurant,
  restaurantVariables,
} from "../../__generated__/restaurant";
import { Dish } from "../../components/dish";
import { CreateOrderIteminput } from "../../__generated__/globalTypes";
import { DishOption } from "../../components/dish-option";
import {
  createOrder,
  createOrderVariables,
} from "../../__generated__/createOrder";

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
      order {
        id
      }
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
  const history = useHistory();

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

  const selectOptionToggle = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find(
          (aOption: { name: string }) => aOption.name === optionName
        )
      );
      if (!hasOption) {
        setOrderItems((current) => current.filter((c) => c.dishId !== dishId));
        setOrderItems((current) => [
          { dishId, options: [{ name: optionName }, ...oldItem.options!] },
          ...current,
        ]);
      } else {
        const oldOptions = [...oldItem.options!];
        const findedIdx = oldOptions?.findIndex(
          (aOption) => aOption.name === optionName
        );
        oldOptions.splice(findedIdx, 1);
        setOrderItems((current) => [
          { dishId, options: [...oldOptions] },
          ...current,
        ]);
      }
    }
  };

  const getOptionFromItem = (
    item: CreateOrderIteminput,
    optionName: string
  ) => {
    return item.options?.find((op: { name: string }) => op.name === optionName);
  };

  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };

  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };

  const onCompleted = ({ createOrder: { ok, order } }: createOrder) => {
    if (ok) {
      alert("주문 완료");
      history.push(`/orders/${order.id}`);
    }
  };

  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted,
  });

  const triggerConfirmOrder = () => {
    if (placingOrder) return;
    if (orderItems.length === 0) {
      alert("주문이 없습니다");
      return;
    }
    const check = window.confirm("이대로 주문하시겠습니까?");
    if (check) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });
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
        {!orderStarted && (
          <button onClick={startOrderToggle} className="btn px-10">
            주문시작
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
              주문완료
            </button>
            <button
              onClick={triggerCancelOrder}
              className="btn px-10 bg-black hover:bg-black"
            >
              주문취소
            </button>
          </div>
        )}

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
            >
              {dish.options?.map((option, idx) => (
                <DishOption
                  key={idx}
                  isSelected={isOptionSelected(dish.id, option.name)}
                  name={option.name}
                  extra={option.extra}
                  dishId={dish.id}
                  selectOptionToggle={selectOptionToggle}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
