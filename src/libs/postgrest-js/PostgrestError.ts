/**
 * PostgREST Error format
 * 
 * Miniprogram-compatible implementation
 */
export interface PostgrestErrorContext {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export class PostgrestError extends Error {
  details: string;
  hint: string;
  code: string;

  constructor(context: PostgrestErrorContext) {
    super(context.message);
    this.name = 'PostgrestError';
    this.details = context.details ?? '';
    this.hint = context.hint ?? '';
    this.code = context.code ?? '';
  }
}
