import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { useUser } from "@auth0/nextjs-auth0";

import User from "components/user";
import List from "components/list";
import Resume from "components/resume";
import LoginPage from "components/login";

export default function Home() {
  const { user, error: authError } = useUser();
  const today_date = new Date().toISOString().split("T")[0];
  const yesterday_date = new Date(new Date().setDate(new Date().getDate() - 1))
    .toISOString()
    .split("T")[0];

  const { data: items } = useSWR(`/api/items?date=${today_date}`);
  if (!authError && user) {
    return (
      <>
        <Head>
          <title>Check your wallet!</title>
        </Head>
        <User user={user} />
        <h1 className="text-lg font-bold font-mono">Hoy {today_date}</h1>
        <Resume items={items} />
        <List items={items} date={today_date} />
        <div className="w-full flex justify-between">
          <Link href={`/${yesterday_date}`}>
            <a>
              <button className="bg-red-500 w-24 h-8 rounded text-white font-bold">
                Atrás
              </button>
            </a>
          </Link>
        </div>
      </>
    );
  } else {
    return <LoginPage />;
  }
}
