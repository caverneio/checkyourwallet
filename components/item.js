const Item = ({ id, description, value, deleteItem }) => {
  const text_color = value > 0 ? "#22c55e" : "#ef4444";
  const handleDelete = () => {
    const confirmation = window.confirm(
      "¿Estás seguro de que quieres eliminar este elemento?"
    );
    if (confirmation) {
      deleteItem(id);
    }
  };

  return (
    <div
      className="flex justify-between divide-x hover:bg-gray-100"
      style={{
        color: text_color,
      }}
    >
      <div className="flex justify-between w-full pr-2">
        <h1 className="text-xl">{description}</h1>
        <button
          type="button"
          onClick={handleDelete}
          className="text-gray-200 hover:text-red-400"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <div className="w-28 text-right">
        <h1 className="text-xl font-mono">{value.toFixed(2)}</h1>
      </div>
    </div>
  );
};

export default Item;
