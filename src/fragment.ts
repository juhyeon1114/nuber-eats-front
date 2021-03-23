import { gql } from "@apollo/client";

export const RESTAURANT_FRAGMENT = gql`
  fragment RestaurantParts on Restaurant {
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
`;

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryParts on Category {
    id
    name
    coverImage
    slug
    restaurantsCount
  }
`;

export const DISH_FRAGMENT = gql`
  fragment DishParts on Dish {
    id
    name
    price
    photo
    description
    options {
      name
      extra
      choices {
        name
        extra
      }
    }
  }
`;

export const ORDERS_FRAGMENT = gql`
  fragment OrdersParts on Order {
    id
    createdAt
    total
  }
`;

export const ORDER_FRAGMENT = gql`
  fragment OrderParts on Order {
    id
    status
    total
    driver {
      email
    }
    customer {
      email
    }
    restaurant {
      name
    }
  }
`;
