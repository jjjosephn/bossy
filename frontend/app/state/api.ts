import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Company {
   companyId: string;
   companyName: string;
   fullAddress: string;
   mapboxId: string;
   timestamp: string;
}

export const api = createApi({
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
   reducerPath: 'api',
   tagTypes: [],
   endpoints: (build) => ({
      checkCompanyExists: build.mutation<any, { mapboxId: string; name: string; fullAddress: string }>({
         query: (body) => ({
            url: '/check-company',
            method: 'POST',
            body,
         })
      }),
   }),
});

export const {
   useCheckCompanyExistsMutation
} = api;
