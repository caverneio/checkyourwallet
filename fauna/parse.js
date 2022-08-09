export default function ParseFaunaObj(obj) {
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return;
    }
    return obj.map((e) => ParseFaunaObj(e));
  }
  if (typeof obj === "object") {
    if (obj.after || obj.before) {
      if (obj.after) {
        return {
          afterId: ParseFaunaObj(obj.after[obj.after.length - 1]),
          data: ParseFaunaObj(obj.data),
        };
      }
      return ParseFaunaObj(obj.data);
    }

    if (obj.collection && obj.id) {
      return { id: obj.id, collection: obj.collection.id };
    }

    Object.keys(obj).forEach((k) => {
      if (obj[k] === null || obj[k] === undefined) {
        delete obj[k];
      } else {
        obj[k] = ParseFaunaObj(obj[k]);
      }
    });
  }
  return obj;
}
