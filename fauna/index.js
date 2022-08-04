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
} = query;

class FaunaClient {
  constructor() {
    this.client = new Client({
      secret: process.env.FAUNADB_SECRET,
      domain: process.env.FAUNADB_DOMAIN,
    });
  }

  async getItems() {
    return this.client
      .query(
        Map(
          Paginate(
            Match(
              Index("items_by_day"),
              FaunaDate(new Date().toISOString().split("T")[0])
            ),
            {
              size: 10,
              after: Ref(Collection("items"), "339095863724867650"),
            }
          ),
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

  async createItem(description, value) {
    return this.client
      .query(
        Create(Collection("items"), {
          data: {
            description,
            value: parseFloat(value),
            day: FaunaDate(new Date().toISOString().split("T")[0]),
          },
        })
      )
      .then((res) => ParseFaunaObj(res));
  }
}

export default FaunaClient;
