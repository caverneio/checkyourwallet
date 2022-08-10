import Image from "next/future/image";

const User = ({ user }) => (
  <div className="flex space-x-2">
    <h1>Hola {user.given_name}</h1>
    <Image
      src={user.picture}
      alt="wallet"
      width={24}
      height={24}
      className="rounded-full"
    />
  </div>
);

export default User;
