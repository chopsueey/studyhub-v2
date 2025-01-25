import { Link } from "react-router";
import slug from "slug";
import type { Route } from "./+types/studies";
import { connectToDB } from "~/backend/connectDB";
import { createStudy, getAllStudies } from "~/backend/functions/study";
import CreateForm from "~/components/CreateForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  // For extra clarity use dynamic imports;
  // it seems like that even unused server-only imports throw an error when creating a build.
  // const { connectToDB } = await import("~/backend/connectDB");
  // const { getAllStudies } = await import("~/backend/functions/study");
  await connectToDB();
  const studies = await getAllStudies();
  return { studies };
}

export async function action({ request }: Route.ActionArgs) {
  await createStudy(await request.formData());
  return;
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
          studies.map((study) => (
            <Link
              key={study._id}
              to={{
                pathname: `/studies/${slug(study.name)}`,
              }}
            >
              <div className="border w-fit p-2 rounded-lg hover:bg-slate-300">
                <p>{study.name}</p>
              </div>
            </Link>
          ))}
      </div>

      {/* The function createStudy (a serveraction) cannot be passed to <CreateForm /> here, like we could in Next.js. */}
      {/* Instead, we can trigger an action function on this route via submitting the form in <CreateForm />.*/}
      {/* And access the auto-generated request object in the action to get the FormData, which we can then pass to a function on the server. */}
      <CreateForm what="study" />
    </main>
  );
}
