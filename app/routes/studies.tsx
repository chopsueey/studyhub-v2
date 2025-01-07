import { Link } from "react-router";
import slug from "slug";
// import CreateForm from "../components/CreateForm";
import type { Route } from "./+types/studies";
import { connectToDB } from "~/backend/connectDB";
import { getAllStudies } from "~/backend/functions/study";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  // for extra clarity use dynamic imports
  // it seems like that even unused server-only imports throw an error when creating a build
  // const { connectToDB } = await import("~/backend/connectDB");
  // const { getAllStudies } = await import("~/backend/functions/study");

  await connectToDB();
  const studies = await getAllStudies();
  console.log(studies)
  return { studies };
}

export default function Studies({ loaderData }: Route.ComponentProps) {
  const { studies } = loaderData;

  if (!studies) {
    return (
      <div>
        <h1>This Study does not exist anymore.</h1>
      </div>
    );
  }

  return (
    <main className="space-y-4 max-w-screen-xl mx-auto">
      <h1>Your studies:</h1>
      {studies.length < 1 && <div>Create a new study first</div>}

      <div className="flex space-x-2">
        {studies.length > 0 &&
          studies.map((subject) => (
            <Link
              key={Math.random().toFixed(4)}
              to={{
                pathname: `/${slug(subject.name)}`,
                search: `?id=${subject.id}`,
              }}
            >
              <div className="border w-fit p-2 rounded-lg hover:bg-slate-300">
                <p>{subject.name}</p>
              </div>
            </Link>
          ))}
      </div>

      {/* createStudy cannot be passed to <CreateForm /> here, like it could in Next.js. */}
      {/* <CreateForm /> should have its own action function where it is declared when build in Remix/ReactRouter. */}
      {/* <CreateForm action={createStudy} what="study" /> */}
    </main>
  );
}
