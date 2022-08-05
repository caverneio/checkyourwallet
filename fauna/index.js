import { Client, query } from "faunadb";
import ParseFaunaObj from "./parse";

const {
  Collection,
  Paginate,
  Map,
  Get,
  Lambda,
  Var,
  Create,
  Match,
  Date: FaunaDate,
  Index,
  Ref,
  Let,
  Select,
  Delete,
} = query;

class FaunaClient {
  constructor() {
    this.client = new Client({
      secret: process.env.FAUNADB_SECRET,
      domain: process.env.FAUNADB_DOMAIN,
    });
  }

  async getItems(date) {
    return this.client
      .query(
        Map(
          Paginate(Match(Index("items_by_day"), FaunaDate(date)), {
            size: 20,
            after: Ref(Collection("items"), "339103095864688712"),
          }),
          Lambda(
            ["ref"],
            Let(
              {
                item: Get(Var("ref")),
              },
              {
                id: Select(["ref", "id"], Var("item")),
                description: Select(["data", "description"], Var("item")),
                value: Select(["data", "value"], Var("item")),
              }
            )
          )
        )
      )
      .then((res) => ParseFaunaObj(res));
  }

  async createItem(date, description, value) {
    return this.client
      .query(
        Create(Collection("items"), {
          data: {
            description,
            value: parseFloat(value),
            day: FaunaDate(date),
          },
        })
      )
      .then((res) => ParseFaunaObj(res));
  }

  async deleteItem(id) {
    return this.client
      .query(Delete(Ref(Collection("items"), id)))
      .then((res) => ParseFaunaObj(res));
  }
}

export default FaunaClient;
