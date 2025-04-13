import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { get } from 'http';

export interface Company {
   companyId: string;
   companyName: string;
   fullAddress: string;
   mapboxId: string;
   timestamp: string;
}

export interface User {
   userId: string;
   firstName: string;
   lastName: string;
   email: string;
   timestamp: string;
}

export interface PendingBosess {
   pendingId: string;
   userId: string;
   bossFirstName: string;
   bossLastName: string;
   position: string;
   companyId: string;
   timestamp: string;
}

export const api = createApi({
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
   reducerPath: 'api',
   tagTypes: [],
   endpoints: (build) => ({
      checkCompanyExists: build.mutation<any, { mapboxId: string; name: string; fullAddress: string }>({
         query: (body) => ({
            url: '/company/check-company',
            method: 'POST',
            body,
         })
      }),

      getCompanyByMapboxId: build.query<Company, string>({
         query: (mapboxId) => `/company/${mapboxId}`,
      }),

      checkUserExists: build.mutation<any, { userId: string; firstName: string; lastName: string; email: string }>({
         query: (body) => ({
            url: '/check-user',
            method: 'POST',
            body,
         })
      }),

      addBossRequest: build.mutation<any, { userId: string; bossFirstName: string; bossLastName: string; position: string; companyId: string }>({
         query: (body) => ({
            url: '/boss/add-boss-request',
            method: 'POST',
            body,
         })
      }),
      getPendingBosses: build.query<PendingBosess[], void>({
         query: () => '/boss/pending-bosses',
      }),
   }),
});

export const {
   useCheckCompanyExistsMutation,
   useGetCompanyByMapboxIdQuery,
   useCheckUserExistsMutation,
   useAddBossRequestMutation,
   useGetPendingBossesQuery,
} = api;
