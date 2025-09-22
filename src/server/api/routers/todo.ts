import { z } from "zod";``
import { todoInput } from "@/types";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { connect } from "http2";

export const todoRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.db.todo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return todos.map(({ id, text, done }) => ({ id, text, done }));
  }),
  // creamos un tipo de validador en un archivo types.ts en src, le decimos a TRPC que tipo de entrada necesitamos, si no que hga bad request
  create: protectedProcedure
    .input(todoInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        // hasta aqui nos da error de que necesita conectarse user,ya que lo llamamos en nuestro modelo
        data: {
          text: input,
          //   aqui ya lo estamos conectando hasta el modelo session para saber que usuario esta en sesion
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      ``;
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.delete({
        where: {
          id: input,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input: { id, done } }) => {
      return ctx.db.todo.update({
        where: {
          id,
        },
        data: {
          done,
        },
      });
    }),
});
