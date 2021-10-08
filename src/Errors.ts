/**
 * Explicit errors thrown in tsbase
 */
export enum Errors {
  InvalidOperation = 'InvalidOperation',
  BadStatusCode = 'BadStatusCode',
  NullHttpClient = 'NullHttpClient - If overriding the default XhrRequestHandler, ensure that you set the \
  HttpClient property to the HttpClient instance the handler belongs to.',
  DomStorageUndefined = 'DomStorageUndefined - Unable to use DomStoragePersister since, \"Storage\" is not defined',
  StateChangeUnnecessary = 'State change unnecessary - nothing changed',
  NoTransactionToUndo = 'No transaction to undo',
  NoTransactionToRedo = 'No transaction to redo'
}
