import type { Todo } from "../types";
//Hacemos la conexion directo para los endponits toggle y delete
import { api } from "@/trpc/react";
import { toast } from "react-hot-toast";
// ya hice la conexion con trpc con el backend en el archivo types, ya solo lo paso como props
type TodoProps = {
  todo: Todo;
};

export default function Todo({ todo }: TodoProps) {
  const { id, text, done } = todo;
  const trpc = api.useUtils();
  // conexion de toggle
  const { mutate: doneMutation } = api.todo.toggle.useMutation({
    onMutate: async ({ id, done }) => {
      await trpc.todo.all.cancel();

      const previosuTodos = trpc.todo.all.getData();
      trpc.todo.all.setData(undefined, (prev) => {
        if (!prev) return previosuTodos;
        return prev.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              done,
            };
          }
          return t;
        });
      });
      return { previosuTodos };
    },
    onSuccess: (errr, { done }) => {
      if (done) {
        toast.success("Todos completados");
      }
    },
    //manejo de errores de backend
    onError: (err, newTodo, context) => {
      toast.error(`Ocurrio un error al ${done ? "done" : "undone"} un Todo`);

      trpc.todo.all.setData(undefined, () => context?.previosuTodos);
    },
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  //conecxion de delete
  const { mutate: deleteMutation } = api.todo.delete.useMutation({
    onMutate: async (deleteId) => {
      await trpc.todo.all.cancel();

      const previosuTodos = trpc.todo.all.getData();

      trpc.todo.all.setData(undefined, (prev) => {
        if (!prev) return previosuTodos;
        return prev.filter((t) => t.id !== deleteId);
      });
      return { previosuTodos };
    },
    //manejo de errores de backend
    onError: (err, newTodo, context) => {
      toast.error("Ocurrio un error al eliminar un Todo");
      trpc.todo.all.setData(undefined, () => context?.previosuTodos);
    },
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });
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
            // aplicacion de togle al hacer check
            onChange={(e) => {
              doneMutation({ id, done: e.target.checked });
            }}
          />
          <label
            htmlFor="done"
            className={`cursor-pointer ${done ? "line-through" : ""}`}
          >
            {text}
          </label>
        </div>

        <button
          className="mb-1 cursor-pointer rounded bg-blue-800 p-3 text-white hover:bg-blue-800 focus:ring-4 focus:outline-none"
          // Aplicacion nde delete al pulsar el boton
          onClick={() => {
            deleteMutation(id);
          }}
        >
          Delete
        </button>
      </div>
    </>
  );
}
