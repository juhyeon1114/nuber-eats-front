/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createOrder
// ====================================================

export interface createOrder_createOrder_order {
  __typename: "Order";
  id: number;
}

export interface createOrder_createOrder {
  __typename: "CreateOrderOutput";
  ok: boolean;
  error: string | null;
  order: createOrder_createOrder_order;
}

export interface createOrder {
  createOrder: createOrder_createOrder;
}

export interface createOrderVariables {
  input: CreateOrderInput;
}
