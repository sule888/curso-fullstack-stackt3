import { z } from "zod";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./server/api/root";

type RouterOutputs = inferRouterOutputs<AppRouter>;
// Aqui abajo trpc esta trabajao trayendose solo en endpoint del api
// ! tipado de salida viene de trpc
type allTodosOutput = RouterOutputs["todo"]["all"];
type deleteTodosoutput = RouterOutputs["todo"]["delete"];

export type Todo = allTodosOutput[number];

export const todoInput = z
  .string({
    required_error: "Describe your todo",
  })
  .min(1)
  .max(100);
