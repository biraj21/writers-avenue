export class CustomError extends Error {
  constructor(message) {
    super(message);
    this.isCustom = true;
  }
}

export class ValidationError extends CustomError {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.status = 422;
  }
}

export class AuthError extends CustomError {
  constructor() {
    super("you are not authorized to perform this action");
    this.name = this.constructor.name;
    this.status = 403;
  }
}
