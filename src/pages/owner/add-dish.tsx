import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/button";
import {
  createDish,
  createDishVariables,
} from "../../__generated__/createDish";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

interface IForm {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<IParams>();
  const history = useHistory();
  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });
  const { register, handleSubmit, formState, getValues } = useForm<IForm>({
    mode: "onChange",
  });
  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    const optionsObject = optionsNumber.map((id) => ({
      name: rest[`${id}-optionName`],
      extra: +rest[`${id}-optionExtra`] > 0 ? +rest[`${id}-optionExtra`] : 0,
    }));
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options: optionsObject,
        },
      },
    });
    history.goBack();
  };
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };
  const onDeleteClick = (id: number) => {
    setOptionsNumber((current) => current.filter((e) => e !== id));
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">메뉴 추가</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          type="text"
          name="name"
          placeholder="이름"
          ref={register({ required: "Name is required." })}
        />
        <input
          className="input"
          type="number"
          name="price"
          min={0}
          placeholder="가격"
          ref={register({ required: "Price is required." })}
        />
        <input
          className="input"
          type="text"
          name="description"
          placeholder="설명"
          ref={register({ required: "Description is required." })}
        />
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">메뉴 옵션</h4>
          <span
            onClick={onAddOptionClick}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-"
          >
            메뉴 옵션 추가
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5">
                <div>dish options</div>
                <input
                  ref={register}
                  name={`${id}-optionName`}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-2"
                  type="text"
                  placeholder="옵션명"
                />
                <input
                  ref={register}
                  name={`${id}-optionExtra`}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                  type="number"
                  min={0}
                  placeholder="옵션가격"
                />
                &nbsp;
                <span
                  onClick={() => {
                    onDeleteClick(id);
                  }}
                >
                  X
                </span>
              </div>
            ))}
        </div>
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="메뉴 생성"
        />
      </form>
    </div>
  );
};
