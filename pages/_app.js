import { SWRConfig } from "swr";
import { UserProvider } from "@auth0/nextjs-auth0";

import "../styles/globals.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  const handleSwitchTheme = () => {
    const theme = localStorage.getItem("theme");

    if (theme === "light") {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else if (theme === "dark") {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <UserProvider>
      <SWRConfig
        value={{
          refreshInterval: 60000,
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <div className="bg-gray-600">
          <div className="space-y-2 mx-auto max-w-xl bg-white dark:bg-gray-800 dark:text-white h-screen flex flex-col p-4 flex flex-col items-center text-center">
            <div className="flex">
              <h1 className="text-3xl font-bold text-center ">
                Check your wallet!
              </h1>
              <button onClick={handleSwitchTheme}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    className="stroke-slate-400 dark:stroke-slate-500"
                  ></path>
                  <path
                    d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
                    className="stroke-slate-400 dark:stroke-slate-500"
                  ></path>
                </svg>
              </button>
            </div>
            <Component {...pageProps} />
          </div>
        </div>
      </SWRConfig>
    </UserProvider>
  );
}

export default MyApp;
