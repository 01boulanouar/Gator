import { z } from "zod"; 
import { XMLParser } from "fast-xml-parser";

const RSSItemSchema = z.object({
    title: z.string(),
    link: z.string(),
    description: z.string(),
    pubDate: z.string()
});

const RSSFeedSchema = z.object({
    rss: z.object({
      channel: z.object({
        title: z.string(),
        link: z.string(),
        description: z.string(),
        item: z.array(RSSItemSchema)
        })
    })
});

export type RSSFeed = z.infer<typeof RSSFeedSchema>;
export type RSSItem = z.infer<typeof RSSItemSchema>

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL, {
        method: "GET",
        headers: {
            "User-Agent": "gator"
        }
    });

    const xml = await response.text();
    const parser = new XMLParser();
    const data =  parser.parse(xml);
    const feed =  RSSFeedSchema.parse(data);
    return feed;
}