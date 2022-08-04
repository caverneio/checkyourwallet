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
      return {
        data: ParseFaunaObj(obj.data),
      };
    }

    if (obj.ref && obj.data) {
      return {
        id: obj.ref.id,
        ...ParseFaunaObj(obj.data),
      };
    }

    if (obj.collection && obj.id) {
      return obj.id;
    }

    Object.keys(obj).forEach((k) => {
      if (k === "data") {
        const d = obj[k];
        delete obj.data;

        Object.keys(d).forEach((dataKey) => {
          obj[dataKey] = ParseFaunaObj(d[dataKey]);
        });
      } else if (obj[k] === null || obj[k] === undefined) {
        delete obj[k];
      } else {
        obj[k] = ParseFaunaObj(obj[k]);
      }
    });
  }
  return obj;
}
