const Resume = ({ items = [] }) => {
  const incomes =
    items && items.length > 0
      ? items
          .filter((item) => item.value > 0)
          .reduce((acc, item) => acc + item.value, 0)
      : 0;

  const expenses =
    items && items.length > 0
      ? items
          .filter((item) => item.value < 0)
          .reduce((acc, item) => acc + item.value, 0)
      : 0;

  const balance = incomes + expenses;
  return (
    <div className="w-full flex flex-col space-y-2 sm:flex-row items-center justify-between w-full">
      <div className="text-green-500 bg-gray-100 w-full sm:w-32 h-10 border rounded flex justify-center items-center">
        <h1 className="text-xl font-bold font-mono">
          <span>S/</span>
          {(incomes && incomes.toFixed(2)) || 0}
        </h1>
      </div>
      <div className="bg-gray-100 w-full sm:w-64 h-16 border rounded flex justify-center items-center">
        <h1 className="dark:text-black text-5xl font-bold font-mono">
          <span className="text-2xl">S/</span>
          {(balance && balance.toFixed(2)) || 0}
        </h1>
      </div>
      <div className="bg-gray-100 w-full sm:w-32 h-10 border rounded flex justify-center items-center">
        <h1 className="text-red-500 text-xl font-bold font-mono">
          <span>S/</span>
          {(expenses && expenses.toFixed(2)) || 0}
        </h1>
      </div>
    </div>
  );
};

export default Resume;
