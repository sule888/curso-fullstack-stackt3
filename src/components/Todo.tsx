import type { Todo } from "../types";
// ya hice la conexion con trpc con el backend en el archivo types, ya solo lo paso como props
type TodoProps = {
  todo: Todo;
};

export default function Todo({ todo }: TodoProps) {
  const { id, text, done } = todo;

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="done"
            id="done"
            checked={done}
            className="boder focus-within: h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-50"
          />
          <label htmlFor="done" className={`cursor-pointer`}>
            {text}
          </label>
        </div>

        <button className="mb-1 cursor-pointer rounded bg-blue-800 p-3 text-white hover:bg-blue-800 focus:ring-4 focus:outline-none">
          Delete
        </button>
      </div>
    </>
  );
}
