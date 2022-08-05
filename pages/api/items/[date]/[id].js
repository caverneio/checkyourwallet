import FaunaClient from "fauna";

export default async function handler(req, res) {
  try {
    if (req.method === "DELETE") {
      const { id } = req.query;
      const client = new FaunaClient();
      const items = await client.deleteItem(id);

      res.status(200).json(items);
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error });
  }
}
