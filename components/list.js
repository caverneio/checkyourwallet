import { useState, useRef } from "react";
import { useSWRConfig } from "swr";
import Item from "components/item";

const List = ({ items = [], date }) => {
  const { mutate } = useSWRConfig();
  const descriptionRef = useRef();
  const valueRef = useRef();
  const [errors, setErrors] = useState([]);

  const handleAddItem = async () => {
    try {
      const description = descriptionRef.current.innerText;
      const value = valueRef.current.innerText;

      if (!description) {
        setErrors([...errors, "La descripción es requerida"]);
        setTimeout(() => setErrors([]), 3000);
        return false;
      }

      if (!value || isNaN(value) || parseFloat(value) === 0) {
        setErrors([
          ...errors,
          "El valor es requerido y debe ser un numero distinto de 0",
        ]);
        setTimeout(() => setErrors([]), 3000);
        return false;
      }

      const addItem = async () => {
        const data = await fetch("/api/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description,
            value,
            date,
          }),
        });
        const addedItem = await data.json();
        const itemsUpdated = [...items, addedItem];
        return itemsUpdated;
      };

      valueRef.current.innerText = "";
      descriptionRef.current.innerText = "";

      mutate(`/api/items?date=${date}`, addItem);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const deleteItem = async () => {
        const data = await fetch(`/api/items/${id}`, {
          method: "DELETE",
        });
        const deletedItem = await data.json();
        const itemsUpdated = items.filter((item) => item.id !== deletedItem.id);
        return itemsUpdated;
      };
      mutate(`/api/items?date=${date}`, deleteItem);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="w-full divide-y dark:divide-gray-600 grid grid-cols-1">
      {items &&
        items.length > 0 &&
        items.map((item) => (
          <Item deleteItem={handleDeleteItem} key={item.id} {...item} />
        ))}
      <div className="flex justify-between">
        <div>
          <div
            ref={descriptionRef}
            type="text"
            contentEditable
            className='
                  hover:cursor-text
                  p-0
                  bg-transparent
                  focus:ring-0
                  border-0 
                  text-xl
                  empty:before:content-["Descripción"]
                  empty:before:text-gray-500
                  empty:before
                  '
          />
        </div>
        <div
          ref={valueRef}
          type="text"
          contentEditable
          className='
                  hover:cursor-text
                  w-28
                  p-0
                  bg-transparent
                  focus:ring-0
                  border-0 
                  text-xl
                  empty:before:content-["S/"]
                  empty:before:text-gray-500
                  empty:before
                  font-mono
                  text-right
                  border-l border-gray-200 dark:border-gray-600
                  ring-0
                  focus:border-gray-200
                  '
        />
      </div>
      {errors &&
        errors.length > 0 &&
        errors.map((error, i) => (
          <div className="text-red-500" key={i}>
            {error}
          </div>
        ))}
      <button
        type="submit"
        onClick={handleAddItem}
        className="w-full mt-2 py-1 bg-blue-500 rounded text-white font-bold text-xl"
      >
        Añadir
      </button>
    </div>
  );
};

export default List;
