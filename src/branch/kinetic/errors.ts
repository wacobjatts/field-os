/**
 * src/branch/kinetic/errors.ts
 *
 * Branch-local error utilities for Kinetic.
 * Keeps branch failures explicit without contaminating core.
 */

export class KineticError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KineticError';
  }
}

export class KineticDataError extends KineticError {
  constructor(message: string) {
    super(message);
    this.name = 'KineticDataError';
  }
}

export class KineticSyncError extends KineticError {
  constructor(message: string) {
    super(message);
    this.name = 'KineticSyncError';
  }
}