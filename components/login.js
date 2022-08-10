import Link from "next/link";
import Head from "next/head";
import Image from "next/future/image";

const LoginPage = () => (
  <>
    <Head>
      <title>Login</title>
    </Head>
    <div className="flex flex-col items-center text-center">
      <h1 className="text-5xl font-black tracking-tighter">
        Check your wallet!
      </h1>
      <p>Maneja tus ingresos y egresos de forma fácil y rápida.</p>
      <Image src="/img_1.webp" alt="wallet" width={300} height={300} />
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
);

export default LoginPage;
