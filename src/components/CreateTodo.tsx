"use client";
import { api } from "@/trpc/react";
import { todoInput } from "@/types";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateTodo() {
  const [newTodo, setNewTodo] = useState("");
  const trpc = api.useUtils();

  const { mutate } = api.todo.create.useMutation({
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });
  return (
    <>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          //   validamos lo que ntra en el input con el tipo que hicimos en types
          const result = todoInput.safeParse(newTodo);
          if (!result.success) {
            console.log("not valid");
            toast.error(result.error.format()._errors.join("\n"));
          }
          mutate(newTodo);
        }}
      >
        <input
          type="text"
          name="new-todo"
          id="new-todo"
          className="br rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900"
          placeholder="new-todo"
          value={newTodo}
          onChange={(e) => {
            setNewTodo(e.target.value);
            console.log("Esto es e", e);
          }}
        />
        <button className="rounded-md bg-blue-700 p-2 text-white hover:bg-blue-800 focus:ring-4 focus:outline-none">
          Create
        </button>
      </form>
    </>
  );
}
