import Fastify from "fastify";
import cors from "@fastify/cors";
import { analyzeMedia } from "@mediasniff/media-analyzer";
import { sanitizeUrl } from "@mediasniff/request-analyzer";
const app = Fastify({ logger: true });
await app.register(cors, { origin: true });
app.get("/api/health", async () => ({
  status: "ok",
  service: "mediasniff-api",
}));
app.post<{ Body: { url?: string; content?: string; contentType?: string } }>(
  "/api/analyze",
  async (request, reply) => {
    const { url, content, contentType } = request.body ?? {};
    if (!url) return reply.code(400).send({ error: "A media URL is required" });
    try {
      return {
        url: sanitizeUrl(url),
        analysis: analyzeMedia(url, content, contentType),
      };
    } catch (error) {
      return reply.code(422).send({
        error:
          error instanceof Error ? error.message : "Unable to analyze source",
      });
    }
  },
);
app.post<{ Body: { content?: string; url?: string } }>(
  "/api/analyze/hls",
  async (request, reply) =>
    request.body?.content
      ? {
          analysis: analyzeMedia(
            request.body.url ?? "manifest.m3u8",
            request.body.content,
          ),
        }
      : reply.code(400).send({ error: "HLS content is required" }),
);
app.post<{ Body: { content?: string; url?: string } }>(
  "/api/analyze/dash",
  async (request, reply) =>
    request.body?.content
      ? {
          analysis: analyzeMedia(
            request.body.url ?? "manifest.mpd",
            request.body.content,
          ),
        }
      : reply.code(400).send({ error: "DASH content is required" }),
);
const port = Number(process.env.PORT ?? 8787);
app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
