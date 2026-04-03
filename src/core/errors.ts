export type FieldErrorCode =
  | 'STORAGE_ERROR'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'AUTH_ERROR'
  | 'AI_SERVICE_ERROR'
  | 'SYNC_ERROR'
  | 'UNKNOWN_ERROR';

export class FieldError extends Error {
  public readonly code: FieldErrorCode;
  public readonly cause?: unknown;

  constructor(code: FieldErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'FieldError';
    this.code = code;
    this.cause = cause;
    Object.setPrototypeOf(this, FieldError.prototype);
  }
}

export function createStorageError(message: string, cause?: unknown): FieldError {
  return new FieldError('STORAGE_ERROR', `[Storage]: ${message}`, cause);
}

export function createNotFoundError(entity: string, id?: string): FieldError {
  const identifier = id ? ` with ID "${id}"` : '';
  return new FieldError(
    'NOT_FOUND',
    `[Resource]: ${entity}${identifier} was not found.`,
    { entity, id }
  );
}

export function createValidationError(message: string, cause?: unknown): FieldError {
  return new FieldError('VALIDATION_ERROR', `[Validation]: ${message}`, cause);
}

export function createAuthError(
  message: string = 'Unauthorized access or expired session.',
  cause?: unknown
): FieldError {
  return new FieldError('AUTH_ERROR', `[Auth]: ${message}`, cause);
}

export function createAIError(message: string, cause?: unknown): FieldError {
  return new FieldError('AI_SERVICE_ERROR', `[AI]: ${message}`, cause);
}
