import FaunaClient from "fauna";
import { withApiAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";

async function handler(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res);
    const client = new FaunaClient(accessToken);

    if (req.method === "DELETE") {
      const { id } = req.query;
      const item = await client.deleteItem(id);
      res.status(200).json(item);
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error });
  }
}
export default withApiAuthRequired(handler);
