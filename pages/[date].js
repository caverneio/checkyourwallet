import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";

import User from "components/user";
import List from "components/list";
import Resume from "components/resume";
import LoginPage from "components/login";

export default function DatePage() {
  const { user, error: authError } = useUser();
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

  const { data: items } = useSWR(date && `/api/items?date=${date}`);
  if (!authError && user) {
    return (
      <>
        <Head>
          <title>
            {date ? "Check your wallet! for " + date : "Check your wallet!"}
          </title>
        </Head>
        <User user={user} />
        <h1 className="text-lg font-bold font-mono">
          {date === today_date
            ? "Hoy"
            : date === yesterday_date
            ? "Ayer"
            : day_names[new Date(date).getDay()]}{" "}
          {date}
        </h1>

        <Resume items={items} />
        <List items={items && items.length && items} date={date} />
        <div className="w-full flex justify-between">
          <Link href={`/${day_back_date}`} passHref>
            <a>
              <button className="bg-red-500 w-24 h-8 rounded text-white font-bold">
                Atrás
              </button>
            </a>
          </Link>
          {day_forward_date && today_date && day_forward_date <= today_date && (
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
    );
  } else {
    return <LoginPage />;
  }
}
