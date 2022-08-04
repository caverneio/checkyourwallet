import FaunaClient from "fauna";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const client = new FaunaClient();
      const items = await client.getItems();

      res.status(200).json(items);
    } else if (req.method === "POST") {
      const client = new FaunaClient();
      const { description, value } = req.body;
      const item = await client.createItem(description, value);
      res.status(200).json(item);
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error });
  }
}
