import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import List from "components/list";
import Resume from "components/resume";

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

  const { data: items, error: dataError } = useSWR(`/api/items?date=${date}`);
  if (!authError && user) {
    return (
      <>
        <Head>
          <title>
            {date ? "Check your wallet! for " + date : "Check your wallet!"}
          </title>
        </Head>
        <div className="flex flex-col space-y-2 pb-4 text-center">
          <div>
            <h1 className="text-3xl font-bold text-center">
              Check your wallet!
            </h1>
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
          <Resume items={items} />
        </div>
        <div>
          <List items={items} date={today_date} />
        </div>
        <div className="flex justify-between px-4">
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
    return (
      <>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-black tracking-tighter">
            Check your wallet!
          </h1>
          <p>Maneja tus ingresos y egresos de forma fácil y rápida.</p>
          <Image src="/img_1.webp" alt="wallet" width={300} height={300} />
        </div>
        <div className="flex justify-between px-4">
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
  }
}
