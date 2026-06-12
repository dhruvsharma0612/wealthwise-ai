import { Router, Response, NextFunction } from "express";
import { z } from "zod";
import { authenticate, AuthRequest } from "../../middleware/auth";
import { chatService } from "./chat.service";

export const chatRouter = Router();

chatRouter.use(authenticate);

const sendMessageSchema = z.object({
  message:   z.string().min(1).max(2000),
  sessionId: z.string().cuid(),
});

// POST /api/chat/sessions         — create new session
chatRouter.post("/sessions", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await chatService.createSession(req.user!.id);
    res.status(201).json(result);
  } catch (err) { next(err); }
});

// GET  /api/chat/sessions         — list sessions
chatRouter.get("/sessions", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sessions = await chatService.getSessions(req.user!.id);
    res.json(sessions);
  } catch (err) { next(err); }
});

// GET  /api/chat/sessions/:id     — get messages
chatRouter.get("/sessions/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const messages = await chatService.getMessages(req.user!.id, req.params.id);
    res.json(messages);
  } catch (err) { next(err); }
});

// DELETE /api/chat/sessions/:id   — delete session
chatRouter.delete("/sessions/:id", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await chatService.deleteSession(req.user!.id, req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// POST /api/chat/message          — send message (standard)
chatRouter.post("/message", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { message, sessionId } = sendMessageSchema.parse(req.body);
    const result = await chatService.sendMessage(req.user!.id, sessionId, message, req.user!.plan);
    res.json(result);
  } catch (err) { next(err); }
});

// POST /api/chat/stream           — send message (streaming SSE)
chatRouter.post("/stream", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { message, sessionId } = sendMessageSchema.parse(req.body);

    res.setHeader("Content-Type",  "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection",    "keep-alive");
    res.flushHeaders();

    for await (const chunk of chatService.streamMessage(req.user!.id, sessionId, message, req.user!.plan)) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) { next(err); }
});
