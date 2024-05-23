import { z } from "zod";

export const MovieSchema = z.object({
    description: z.string(),
    id: z.string(),
    ttid: z.string(),
    img_high: z.string(),
    link: z.string(),
    rating_count: z.number(),
    rating_value: z.number(),
    release_date: z.string(),
    runtime: z.string(),
    title: z.string(),
    trailer: z.string(),
    type: z.string(),
    genres: z.array(z.string()),
  });
  
export type Movie = z.infer<typeof MovieSchema>;