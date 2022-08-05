import FaunaClient from "fauna";
import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
async function handler(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res);
    const client = new FaunaClient(accessToken);

    if (req.method === "GET") {
      const { date } = req.query;
      const items = await client.getItems(date);

      res.status(200).json(items);
    } else if (req.method === "POST") {
      const { date } = req.query;
      const { description, value } = req.body;
      const item = await client.createItem(date, description, value);
      res.status(200).json(item);
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error });
  }
}
export default withApiAuthRequired(handler);
