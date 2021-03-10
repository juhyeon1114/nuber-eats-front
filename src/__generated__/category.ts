/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CategoryInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: category
// ====================================================

export interface category_category_category {
  __typename: "Category";
  id: number;
  name: string;
  coverImage: string | null;
  slug: string;
  restaurantsCount: number;
}

export interface category_category_results_category {
  __typename: "Category";
  id: number;
  name: string;
}

export interface category_category_results {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string;
  category: category_category_results_category | null;
  address: string;
  isPromoted: boolean;
}

export interface category_category {
  __typename: "CategoryOutput";
  ok: boolean;
  error: string | null;
  totalPages: number | null;
  totalItems: number | null;
  category: category_category_category | null;
  results: category_category_results[] | null;
}

export interface category {
  category: category_category;
}

export interface categoryVariables {
  input: CategoryInput;
}
