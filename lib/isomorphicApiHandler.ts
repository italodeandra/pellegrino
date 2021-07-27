import {
  NextApiRequest,
  NextApiResponse,
} from "next/dist/next-server/lib/utils";
import { isServer } from "@italodeandra/pijama/utils/isBrowser";

export function createClientApiHandler<Args = undefined, Response = void>(
  route: string
): (args: Args) => Response {
  return (args: any) => ({ route, args } as any);
}

export default function isomorphicApiHandler<Args = undefined, Response = void>(
  route: string,
  apiHandler: (
    req: Omit<NextApiRequest, "body"> & { body: Args },
    res: NextApiResponse<Response>
  ) => void | Promise<void>
): (args: Args) => Response {
  const serverApiHandler = apiHandler as any;
  const clientApiHandler = createClientApiHandler(route) as any;

  serverApiHandler.pellegrinoSchema = clientApiHandler;

  return isServer ? serverApiHandler : clientApiHandler;
}
