import { PipeTransform } from "@angular/core";
import { DeepReadonly } from "ts-essentials";

export type HttpRequestState = DeepReadonly<
  'EMPTY' | 'FETCHING' | 'FETCHED' |
  { errorMessage: string }
  >;

export type MessageResponseType = {
  readonly message: string
}
