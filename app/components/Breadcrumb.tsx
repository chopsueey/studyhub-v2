import { Link, useLocation } from "react-router";

export default function Breadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split("/").slice(1);
  return (
    <div className="flex items-center my-2">
      {paths.map((path, index) => {
        if (index == 1 || index > 2) {
          return (
            <span key={index}>
              {index > 1 && <span className="mx-1"> &gt; </span>}
              <Link
                to={`/${paths.slice(0, index + 1).join("/")}`}
                className={`hover:text-black  ${index == paths.length - 1 ? "font-extrabold text-black/100 underline " : null} text-black/50 transition-all duration-200`}
              >
                {path.toUpperCase()}
              </Link>
            </span>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}
