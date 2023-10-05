// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { BASE_URL } from "./constants";

// initialize an empty api service that we'll inject endpoints into later as needed
export const uberApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api` }),
  //global settings
  //refetchOnMountOrArgChange: true, //always refetch on mount//avoid stale state
  refetchOnReconnect: true, //refetch after regaining a network connection.
  tagTypes: ["User"], //defines tags//can be ["Post", "User"],//possible tags that could be provided by endpoints

  endpoints: () => ({}),
});
