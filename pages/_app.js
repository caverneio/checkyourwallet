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
    document.documentElement.classList.add(theme === "dark" && "dark");
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
          <div className="space-y-2 mx-auto max-w-xl bg-white dark:bg-gray-800 dark:text-white h-screen flex flex-col p-4">
            <Component {...pageProps} />
            <button
              onClick={handleSwitchTheme}
              className="ml-4 font-black text-xs bg-yellow-300 w-10 h-10 rounded-full text-black"
            >
              ST
            </button>
          </div>
        </div>
      </SWRConfig>
    </UserProvider>
  );
}

export default MyApp;
