export class CustomError extends Error {
  isCustom: boolean;
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.isCustom = true;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400);
    this.name = this.constructor.name;
  }
}

export class ActionForbiddenError extends CustomError {
  constructor() {
    super("you are not authorized to perform this action", 403);
    this.name = this.constructor.name;
  }
}

export class AuthError extends CustomError {
  constructor(message: string) {
    super(message, 401);
    this.name = this.constructor.name;
  }
}
