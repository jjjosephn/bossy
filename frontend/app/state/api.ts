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
   User: User;
   Company: Company;
}

export interface Boss {
   bossId: string;
   bossFirstName: string;
   bossLastName: string;
   position: string;
   companyId: string;
   timestamp: string;
   Company: Company;
}
 
export interface ArchivedForm {
   archiveId: string;
   userId: string;
   bossFirstName: string;
   bossLastName: string;
   position: string;
   companyId: string;
   timestamp: string;
   requestedDate: string;
   status: string;
   User: User;
   Company: Company;
}

export interface BossReview {
   reviewId: string;
   reviewText: string;
   rating: number;
   term: string;
   userId?: string;
   bossId: string;
   timestamp: string;
   Boss: Boss;
   User: User;
}

export interface PendingBossReview {
   pendingId: string;
   reviewId: string;
   Review: BossReview;
}

export interface NewBossReview {
   reviewText: string;
   rating: number;
   term: string;
   userId?: string;
   bossId: string;
}

export interface ArchivedBossReview {
   archiveId: string;
   bossId: string;
   userId?: string;
   reviewText: string;
   status: string;
   requestedDate: string;
   timestamp: string;
   User: User;
   Boss: Boss;
}

export const api = createApi({
   baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
   reducerPath: 'api',
   tagTypes: [],
   endpoints: (build) => ({
      // Home Page
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
            url: '/user/check-user',
            method: 'POST',
            body,
         })
      }),

      // Hero Section
      addBossRequest: build.mutation<any, { userId: string; bossFirstName: string; bossLastName: string; position: string; companyId: string }>({
         query: (body) => ({
            url: '/boss/add-boss-request',
            method: 'POST',
            body,
         })
      }),
      getBosses: build.query<Boss[], string>({
         query: (mapboxId) => `/boss/${mapboxId}`,
      }),

      //Admin Page
      getPendingBosses: build.query<PendingBosess[], void>({
         query: () => '/admin/pending-bosses',
      }),
      acceptPendingBossRequest: build.mutation<any, { bossFirstName: string; bossLastName: string; position: string; companyId: string; userId: string, pendingId: string, status: string, requestedDate: string }>({
         query: (body) => ({
            url: '/admin/accept-boss-request',
            method: 'POST',
            body,
         })
      }),
      declinePendingBossRequest: build.mutation<any, { bossFirstName: string; bossLastName: string; position: string; companyId: string; userId: string, pendingId: string, status: string, requestedDate: string }>({
         query: (body) => ({
            url: '/admin/decline-boss-request',
            method: 'POST',
            body,
         })
      }),
      getArchivedForms: build.query<ArchivedForm[], void>({
         query: () => '/admin/archived-bosses',
      }),
      getPendingBossReviews: build.query<PendingBossReview[], void>({
         query: () => '/admin/pending-boss-reviews',
      }),
      acceptPendingBossReview: build.mutation<any, { reviewId: string; pendingId: string; }>({
         query: (body) => ({
            url: '/admin/accept-pending-boss-review',
            method: 'POST',
            body,
         })
      }),
      declinePendingBossReview: build.mutation<any, { reviewId: string; pendingId: string; }>({
         query: (body) => ({
            url: '/admin/decline-pending-boss-review',
            method: 'POST',
            body,
         })
      }),
      getArchivedBossReviews: build.query<ArchivedBossReview[], void>({
         query: () => '/admin/archived-boss-reviews',
      }),

      //Boss Page
      getBossInfo: build.query<Boss, string>({
         query: (bossId) => `/boss/info/${bossId}`,
      }),

      // Reviews
      newBossReview: build.mutation<any, NewBossReview>({
         query: (body) => ({
            url: '/review/new',
            method: 'POST',
            body,
         })
      }),
      getBossReviews: build.query<BossReview[], string>({
         query: (bossId) => `/review/boss/${bossId}`,
      }),

      // Profile Page
      getReviewsByUserId: build.query<BossReview[], string>({
         query: (userId) => `/user/get-reviews/${userId}`,
      }),
   }),
});

export const {
   useCheckCompanyExistsMutation,
   useGetCompanyByMapboxIdQuery,
   useCheckUserExistsMutation,
   useAddBossRequestMutation,
   useGetBossesQuery,
   useGetPendingBossesQuery,
   useAcceptPendingBossRequestMutation,
   useDeclinePendingBossRequestMutation,
   useGetArchivedFormsQuery,
   useGetBossInfoQuery,
   useNewBossReviewMutation,
   useGetBossReviewsQuery,
   useGetPendingBossReviewsQuery,
   useAcceptPendingBossReviewMutation,
   useDeclinePendingBossReviewMutation,
   useGetArchivedBossReviewsQuery,
   useGetReviewsByUserIdQuery
} = api;
