import { NextApiRequest, NextApiResponse } from "next"
import { connectDb } from "./connectDb"
import { Pellegrino } from "./Pellegrino"

export type Options = {
  /** @default true */
  connectDb: boolean
}

export const createApiHandler = (
  entities: Pellegrino[],
  options: Options = {
    connectDb: true,
  }
) => {
  let pellegrinos: any = {}
  for (const pellegrino of entities) {
    pellegrinos = { ...pellegrinos, [pellegrino.name]: pellegrino }
  }
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (options.connectDb) {
        await connectDb()
      }
      const [model, method] = req.query.pellegrino as any[]
      const args = req.body
      if (!pellegrinos[model]) {
        console.error(`The model "${model}" doesn't exists`)
        res.status(500).send({ message: "Internal Error" })
        return
      }
      const data = await pellegrinos[model][method](...args)
      res.send(data)
    } catch (e) {
      console.error(e)
      res.status(500).send({ message: "Internal Error" })
    }
  }
}
