"use client";
import { api } from "@/trpc/react";
import Todo from "./Todo";
export default function Todos() {
  const { data: todos, isLoading, isError } = api.todo.all.useQuery();
  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error</p>;

  return (
    <div>
      Todos componente
      <ul>
        {todos?.length
          ? todos.map((todo) => {
              return <Todo key={todo.id} todo={todo} />;
            })
          : "create your firts todo"}
      </ul>
    </div>
  );
}
