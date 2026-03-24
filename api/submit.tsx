import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const data = req.body;

      console.log("🔥 New Lead:", data);

      return res.status(200).json({
        success: true,
        message: "Quote request received!",
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }

  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}
