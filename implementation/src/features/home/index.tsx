import { Link } from "react-router";
import { MAIN_PATHS } from "../../constants";

const Home = () => {
  return (
    <div className="flex gap-2 flex-1 justify-center items-center">
      {MAIN_PATHS.map((p) => (
        <Link
          className="border border-blue-700 bg-green-300 px-2 py-0.5 rounded-md"
          to={p}
        >
          {p.replace("/", "")}
        </Link>
      ))}
    </div>
  );
};

export default Home;
