import { Form, useNavigation } from "react-router";

export default function CreateForm({ what }: { what: string }) {
  const navigate = useNavigation();
  console.log(navigate.state);
  return (
    <div className="w-fit px-4 py-2 rounded-lg bg-green-500 font-semibold shadow-sm hover:bg-green-600 hover:shadow-md transition-all duration-300">
      <Form method="post" className="space-x-2">
        <input
          className="border rounded-lg p-1"
          name="name"
          type="text"
          minLength={3}
          required
          disabled={navigate.state == "submitting"}
        />
        <button
          className="text-white"
          type="submit"
          disabled={navigate.state == "submitting"}
        >
          New {what}
        </button>
      </Form>
    </div>
  );
}

// export default function CreateForm({
//   action,
//   what,
//   param,
//   id,
// }: ServerActionsForm) {
//   const callback = async (formData: FormData) => {
//     if (!param || !id) {
//       await (action as (formData: FormData) => Promise<void>)(formData);
//     } else {
//       (
//         await (action as (
//           formData: FormData,
//           param: string,
//           id: string
//         ) => Promise<void>)
//       )(formData, param, id);
//     }
//   };

//   return (
//     <div className="w-fit px-4 py-2 rounded-lg bg-green-500 font-semibold shadow-sm hover:bg-green-600 hover:shadow-md transition-all duration-300">
//       <form action={callback} className="space-x-2">
//         <input
//           className="border rounded-lg p-1"
//           name="name"
//           type="text"
//           minLength={3}
//           required
//         />
//         <button className="text-white" type="submit">New {what}</button>
//       </form>
//     </div>
//   );
// }

// type ServerActionsForm =
//   | {
//       action: (formData: FormData) => Promise<void>;
//       what: string;
//       param?: string;
//       id?: string;
//     }
//   | {
//       action: (formData: FormData, param: string, id: string) => Promise<void>;
//       what: string;
//       param: string;
//       id: string;
//     };
