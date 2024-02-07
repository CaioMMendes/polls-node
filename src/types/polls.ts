import z from "zod";




export const createPollBody=z.object({
    title:z.string().min(1)
})