import React, { useState } from "react";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import {
  createRestaurant,
  createRestaurantVariables,
} from "../../__generated__/createRestaurant";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { useHistory } from "react-router-dom";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const history = useHistory();
  const client = useApolloClient();
  const [imageUrl, setImageUrl] = useState();

  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { name, categoryName, address } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY }); //cache의 현재 state를 읽고 있음
      if (queryResult) {
        client.writeQuery({
          query: MY_RESTAURANTS_QUERY,
          data: {
            myRestaurants: {
              ...queryResult.myRestaurants,
              restaurants: [
                {
                  id: restaurantId,
                  name,
                  category: { name: categoryName, __typename: "Category" },
                  isPromoted: false,
                  address,
                  coverImage: imageUrl,
                  __typename: "Restaurant",
                },
                ...queryResult.myRestaurants.restaurants,
              ],
            },
          },
        });
      }
      history.push("/");
    }
  };
  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    refetchQueries: client.readQuery({ query: MY_RESTAURANTS_QUERY })
      ? []
      : [{ query: MY_RESTAURANTS_QUERY }], // 레스토랑 생성 후, 레스토랑 목록을 다시 가져옴
  });
  const { register, getValues, formState, handleSubmit } = useForm<IFormProps>({
    mode: "onChange",
  });
  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImage } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImageUrl(coverImage);
      createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImage,
          },
        },
      });
    } catch (e) {}
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">음식점 생성</h4>
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
          type="text"
          name="address"
          placeholder="주소"
          ref={register({ required: "Address is required." })}
        />
        <input
          className="input"
          type="text"
          name="categoryName"
          placeholder="카테고리"
          ref={register({ required: "Category Name is required." })}
        />
        <div>
          <input
            type="file"
            name="file"
            accept="image/*"
            ref={register({ required: true })}
          />
        </div>
        <Button
          loading={uploading}
          canClick={formState.isValid}
          actionText="생성"
        />
        {data?.createRestaurant?.error && (
          <FormError msg={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
