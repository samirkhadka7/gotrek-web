import { IUserDocument } from './models';

declare global {
  namespace Express {
    // Override Passport's User type
    interface User extends IUserDocument {}

    interface Request {
      user?: IUserDocument;
    }
  }
}
