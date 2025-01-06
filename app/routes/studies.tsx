import { Link, useLoaderData } from "react-router";
import { createStudy, getAllStudies } from "backend/functions/study";
import slug from "slug";
import CreateForm from "../components/CreateForm";
import { connectToDB } from "backend/connectDB";

export async function loader() {
  await connectToDB();
  const studies = await getAllStudies();
  return studies;
}

export default function Studies() {
  const studies = useLoaderData<typeof loader>();

  if (!studies) {
    return (
      <div>
        <h1>This note does not exist anymore.</h1>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-screen-xl mx-auto">
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

      <CreateForm action={createStudy} what="study" />
    </div>
  );
}
