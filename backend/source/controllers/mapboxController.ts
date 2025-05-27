import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const sessionToken = (`${Math.random().toString(36).substring(2)}-${Date.now()}`)


export const fetchSearchComponentMapboxData = async (
  req: Request,
  res: Response
): Promise<void> => {

   try {
      const {encodedSearch, locationString} = req.query;
      if (!encodedSearch || !locationString) {
         res.status(400).json({ error: "Missing required query parameters." });
         return;
      }

      const response = await fetch(
         `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodedSearch}&language=en&types=poi&limit=10&proximity=${locationString}&session_token=${sessionToken}&access_token=${ACCESS_TOKEN}`
      )

      const mapboxData = await response.json(); 
      res.status(200).json(mapboxData);
   } catch (error) {
      console.error("Error fetching Mapbox data:", error);
      res.status(500).json({ error: "Internal server error" });
   }
}

export const fetchCustomSearchMapboxData = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const { selectedAddressMapboxId } = req.query;
      if (!selectedAddressMapboxId) {
         res.status(400).json({ error: "Missing required query parameters." });
         return;
      }

      const response = await fetch(
         `https://api.mapbox.com/search/searchbox/v1/retrieve/${selectedAddressMapboxId}?session_token=${sessionToken}&access_token=${ACCESS_TOKEN}`,
      );

      if (!response.ok) {
         throw new Error("Failed to fetch Mapbox data");
      }

      const mapboxData = await response.json();
      res.status(200).json(mapboxData);
   } catch (error) {
      console.error("Error fetching Mapbox data:", error);
      res.status(500).json({ error: "Internal server error" });
   }
}

export const fetchMapboxUtilsData = async (
   req: Request,
   res: Response
): Promise<void> => {
   try {
      const {
         query,
         proximity,
         customLocation,
         searchType = "poi,address",
         enabled,
         limit = "10",
      } = req.query;

      if (!query || !enabled) {
         res.status(400).json({ error: "Missing required query parameters." });
         return;
      }

      const encodedSearch = encodeURIComponent(query as string);
      const sessionToken = Math.random().toString(36).substring(2);

      const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodedSearch}&language=en&types=${searchType}&limit=${limit}${
         customLocation || proximity
         ? `&proximity=${customLocation || proximity}`
         : ""
      }&session_token=${sessionToken}&access_token=${ACCESS_TOKEN}`;

      const response = await fetch(url);

      if (!response.ok) {
         throw new Error("Mapbox API error");
      }

      const data = await response.json();
      res.status(200).json(data);
   } catch (error) {
      console.error("Error fetching Mapbox data:", error);
      res.status(500).json({ error: "Internal server error" });
   }
}

