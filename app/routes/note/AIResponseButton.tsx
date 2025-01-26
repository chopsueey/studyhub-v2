import { useEffect, useState } from "react";
import ReactMarkDown from "react-markdown";
import Quiz from "./Quiz";
import { useFetcher } from "react-router";

export default function AIResponseButton({ option }: { option: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const fetcher = useFetcher();

  const options = ["Summary", "Terms and keywords", "Quiz", "Advanced Quiz"];

  useEffect(() => {
    if (fetcher.state == "idle" && fetcher.data) {
      setIsOpen(true);
    }
  }, [fetcher.state, fetcher.data]);

  if (option == 2 || option == 3) {
    return (
      <div className="space-y-2 rounded-lg p-2 flex justify-center">
        {isOpen && (
          <>
            {fetcher.data && <Quiz quiz={JSON.parse(fetcher.data)} />}
            <fetcher.Form method="POST">
              <input type="hidden" name="option" value={option} />
              <button
                className="w-fit px-4 py-2 ml-auto mt-4 rounded-lg bg-green-500 text-white font-semibold shadow-sm hover:bg-green-600 hover:shadow-md transition-all duration-300"
                type="submit"
                disabled={fetcher.state == "submitting"}
              >
                {fetcher.state == "submitting"
                  ? "Loading..."
                  : isOpen
                  ? "Create again"
                  : `Create`}
              </button>
            </fetcher.Form>
          </>
        )}
        {!isOpen && (
          <fetcher.Form method="POST">
            <input type="hidden" name="option" value={option} />
            <button
              className="w-fit px-4 py-2 mx-auto rounded-lg bg-green-500 text-white font-semibold shadow-sm hover:bg-green-600 hover:shadow-md transition-all duration-300"
              type="submit"
              disabled={fetcher.state == "submitting"}
            >
              {fetcher.state == "submitting"
                ? "Loading..."
                : `Create ${options[option]}`}
            </button>
          </fetcher.Form>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-lg p-2 flex justify-center">
      {isOpen && (
        <details
          open={isOpen}
          className="group border border-gray-200 rounded-lg shadow-sm transition-all duration-300 open:shadow-lg open:border-gray-300"
        >
          <summary className="flex items-center justify-between cursor-pointer px-4 py-2 text-lg font-semibold text-gray-700 bg-gray-100 rounded-lg group-open:bg-gray-200 group-open:text-gray-800 transition-all duration-300">
            {options[option]}
            <span className="ml-2 transform transition-transform duration-300 group-open:rotate-180">
              ▼
            </span>
          </summary>
          <div className="flex flex-col p-4 text-gray-600 bg-gray-50 rounded-b-lg overflow-y-scroll max-h-[50vh]">
            {fetcher.data && <ReactMarkDown>{fetcher.data}</ReactMarkDown>}
            <fetcher.Form method="POST">
              <input type="hidden" name="option" value={option} />
              <button
                className="w-fit px-4 py-2 ml-auto mt-4 rounded-lg bg-green-500 text-white font-semibold shadow-sm hover:bg-green-600 hover:shadow-md transition-all duration-300"
                type="submit"
                disabled={fetcher.state == "submitting"}
              >
                {fetcher.state == "submitting"
                  ? "Loading..."
                  : isOpen
                  ? "Create again"
                  : `Create`}
              </button>
            </fetcher.Form>
          </div>
        </details>
      )}
      {!isOpen && (
        <fetcher.Form method="POST">
          <input type="hidden" name="option" value={option} />
          <button
            className="w-fit px-4 py-2 mx-auto rounded-lg bg-green-500 text-white font-semibold shadow-sm hover:bg-green-600 hover:shadow-md transition-all duration-300"
            type="submit"
            disabled={fetcher.state == "submitting"}
          >
            {fetcher.state == "submitting"
              ? "Loading..."
              : `Create ${options[option]}`}
          </button>
        </fetcher.Form>
      )}
    </div>
  );
}
