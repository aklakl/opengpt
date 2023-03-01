export class RealizationError extends Error {
  userFacing: boolean;
  retryable: boolean;
  originalError: any;
  constructor(
    error: any,
    public reference: string,
    userFacingErrors: any[] = [],
    retryableErrors: any[] = [],
  ) {
    super(error);
    this.originalError = error;
    this.userFacing = userFacingErrors.some(err => error instanceof err);
    this.retryable = retryableErrors.some(err => error instanceof err);
  }
}

export class OrchestrationError extends Error {
  constructor(
    message: string,
    public operation: string,
    public orchestrator: string,
    public details: object,
  ) {
    message = message.replace(
      /([^.@\s]+)(\.[^.@\s]+)*@([^.@\s]+\.)+([^.@\s]+)/,
      '[REDACTED]',
    );
    super(message);
  }
}

export class RetryableOrchestrationError extends OrchestrationError {}

export class FatalOrchestrationError extends OrchestrationError {}
