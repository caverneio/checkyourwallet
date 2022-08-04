import { useState, useEffect, useRef } from "react";

import Item from "components/item";

export default function Home() {
  const counter = useRef(0);

  const descriptionRef = useRef();
  const valueRef = useRef();

  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState([]);

  const incomes =
    items &&
    items
      .filter((item) => item.value > 0)
      .reduce((acc, item) => acc + item.value, 0);

  const expenses =
    items &&
    items
      .filter((item) => item.value < 0)
      .reduce((acc, item) => acc + item.value, 0);

  const balance = incomes + expenses;

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items");
      const items = await response.json();
      setItems(items.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (counter.current === 0) {
      fetchItems();
    }
    counter.current++;
  }, []);

  const addItem = async () => {
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

      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          value,
        }),
      });

      const created = await response.json();
      if (created) {
        setItems([created, ...items]);
        valueRef.current.innerText = "";
        descriptionRef.current.innerText = "";
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-600">
      <div className="mx-auto max-w-xl bg-gray-50 h-screen flex flex-col p-4">
        <div className="flex flex-col space-y-2 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-center">Tu balance</h1>
            <p className="text-center">Hoy {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="text-green-500 bg-gray-100 w-32 h-10 border rounded flex justify-center items-center">
              <h1 className="text-2xl font-bold font-mono">
                <span className="text-xl">S/</span>
                {(incomes && incomes.toFixed(2)) || 0}
              </h1>
            </div>
            <div className="bg-gray-100 w-48 h-16 border rounded flex justify-center items-center">
              <h1 className="text-5xl font-bold font-mono">
                <span className="text-xl">S/</span>
                {(balance && balance.toFixed(2)) || 0}
              </h1>
            </div>
            <div className="bg-gray-100 w-32 h-10 border rounded flex justify-center items-center">
              <h1 className="text-red-500 text-2xl font-bold font-mono">
                <span className="text-xl">S/</span>
                {(expenses && expenses.toFixed(2)) || 0}
              </h1>
            </div>
          </div>
        </div>
        <div>
          <div className="divide-y px-4 grid grid-cols-1">
            {items &&
              items.length > 0 &&
              items.map((item) => <Item key={item.id} {...item} />)}
            <div className="flex justify-between">
              <div>
                <div
                  ref={descriptionRef}
                  type="text"
                  contentEditable
                  className='
                  -ml-3
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
                  w-[5.75rem]
                  bg-transparent
                  focus:ring-0
                  border-0 
                  text-xl
                  empty:before:content-["S/"]
                  empty:before:text-gray-500
                  empty:before
                  font-mono
                  text-right
                  -mr-3
                  border-l border-gray-200
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
              onClick={addItem}
              className="w-full mt-2 py-1 bg-blue-500 rounded text-white font-bold text-xl"
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
