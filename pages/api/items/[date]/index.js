import FaunaClient from "fauna";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { date } = req.query;
      const client = new FaunaClient();
      const items = await client.getItems(date);

      res.status(200).json(items);
    } else if (req.method === "POST") {
      const client = new FaunaClient();
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
