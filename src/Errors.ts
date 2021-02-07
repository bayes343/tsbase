export enum Errors {
  IndexOutOfRange = 'IndexOutOfRange',
  InvalidOperation = 'InvalidOperation',
  BadStatusCode = 'BadStatusCode',
  NullHttpClient = 'NullHttpClient - If overriding the default XhrRequestHandler, ensure that you set the \
  HttpClient property to the HttpClient instance the handler belongs to.',
  WebStorageUndefined = 'WebStorageUndefined - Unable to use WebStoragePersister since, \"Storage\" is not defined',
  Base64DecodingFailed = 'Unable to decode base64 file',
  Base64EncodingFailed = 'Unable to encode base64 file',
  StateChangeUnnecessary = 'State change unnecessary - nothing changed',
  NoTransactionToUndo = 'No transaction to undo',
  NoTransactionToRedo = 'No transaction to redo'
}
