import { ActionWithPayload } from 'typings/actions';

export enum ErrorActions {
  Http = '[Error] Http'
}

export class HttpErrorAction implements ActionWithPayload<any> {
  readonly type = ErrorActions.Http;
  constructor(readonly payload: any) {}
}
