const Item = ({ description, value }) => {
  const text_color = value > 0 ? "#22c55e" : "#ef4444";
  return (
    <div
      className="flex justify-between divide-x"
      style={{
        color: text_color,
      }}
    >
      <div>
        <h1 className="text-xl">{description}</h1>
      </div>
      <div className="w-20 text-right">
        <h1 className="text-xl font-mono">{value.toFixed(2)}</h1>
      </div>
    </div>
  );
};

export default Item;
