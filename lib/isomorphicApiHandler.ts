import {
  NextApiRequest,
  NextApiResponse,
} from "next/dist/next-server/lib/utils";
import { isServer } from "@italodeandra/pijama/utils/isBrowser";

export default function isomorphicApiHandler<Args = undefined, Response = void>(
  route: string,
  apiHandler: (
    req: Omit<NextApiRequest, "body"> & { body: Args },
    res: NextApiResponse<Response>
  ) => void | Promise<void>
) {
  return (isServer
    ? apiHandler
    : (args: any) => ({ route, args })) as unknown as (args: Args) => Response;
}
