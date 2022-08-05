import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import Item from "components/item";

export default function DatePage() {
  const { user, error } = useUser();
  const day_names = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sabado",
    "Domingo",
  ];
  const router = useRouter();
  const today_date = new Date().toISOString().split("T")[0];
  const yesterday_date = new Date(new Date().setDate(new Date().getDate() - 1))
    .toISOString()
    .split("T")[0];
  const { date } = router.query;
  const day_back_date =
    date &&
    new Date(new Date(date).setDate(new Date(date).getDate() - 1))
      .toISOString()
      .split("T")[0];
  const day_forward_date =
    date &&
    new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      .toISOString()
      .split("T")[0];

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
      if (date) {
        const response = await fetch("/api/items/" + date);
        const items = await response.json();
        if (items.data && items.data.length > 0) {
          setItems(items.data);
        } else {
          setItems([]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (date) {
      fetchItems();
    }
  }, [date]);

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

      const response = await fetch("/api/items/" + date, {
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
        setItems([...items, created]);
        valueRef.current.innerText = "";
        descriptionRef.current.innerText = "";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch("/api/items/" + today_date + "/" + id, {
        method: "DELETE",
      });
      const deleted = await response.json();
      if (deleted) {
        setItems(items.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>{date ? "Tu balance el " + date : "Check your wallet!"}</title>
      </Head>
      <div className="bg-gray-600">
        <div className="space-y-2 mx-auto max-w-xl bg-white h-screen flex flex-col p-4">
          {!error && user ? (
            <>
              <div className="flex flex-col space-y-2 pb-4 text-center">
                <div>
                  <h1 className="text-3xl font-bold text-center">Tu balance</h1>
                  <p className="text-center">
                    {date === today_date
                      ? "Hoy"
                      : date === yesterday_date
                      ? "Ayer"
                      : day_names[new Date(date).getDay()]}{" "}
                    {date}
                  </p>
                  <Image
                    src={user.picture}
                    alt="wallet"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </div>
                <div className="flex flex-col space-y-2 sm:space-x-2 sm:flex-row items-center justify-between w-full">
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
                    items.map((item) => (
                      <Item deleteItem={deleteItem} key={item.id} {...item} />
                    ))}
                  <div className="flex justify-between">
                    <div>
                      <div
                        ref={descriptionRef}
                        type="text"
                        contentEditable
                        className='
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
              <div className="flex justify-between px-4">
                <Link href={`/${day_back_date}`} passHref>
                  <a>
                    <button className="bg-red-500 w-24 h-8 rounded text-white font-bold">
                      Atrás
                    </button>
                  </a>
                </Link>
                {day_forward_date &&
                  today_date &&
                  day_forward_date <= today_date && (
                    <Link href={`/${day_forward_date}`} passHref>
                      <a>
                        <button className="bg-red-500 w-24 h-8 rounded text-white font-bold">
                          Adelante
                        </button>
                      </a>
                    </Link>
                  )}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-center">
                <h1 className="text-5xl font-black tracking-tighter">
                  Check your wallet!
                </h1>
                <p>Maneja tus ingresos y egresos de forma fácil y rápida.</p>
                <Image
                  src="/img_1.webp"
                  alt="wallet"
                  width={300}
                  height={300}
                />
              </div>
              <div className="flex justify-center">
                <Link href="/api/auth/login">
                  <a>
                    <button className="bg-red-500 w-64 h-8 rounded text-white font-bold">
                      Ingresa
                    </button>
                  </a>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
