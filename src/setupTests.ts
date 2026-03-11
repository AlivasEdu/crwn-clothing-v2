import { TextEncoder, TextDecoder } from "util";
import fetch, { Response, Request, Headers } from "node-fetch";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
global.fetch = fetch as unknown as typeof global.fetch;
global.Response = Response as unknown as typeof global.Response;
global.Request = Request as unknown as typeof global.Request;
global.Headers = Headers as unknown as typeof global.Headers;