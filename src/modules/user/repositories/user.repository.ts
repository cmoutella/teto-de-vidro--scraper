import {
  InterfaceUser,
  PublicInterfaceUser,
} from '../schemas/models/user.interface';

export abstract class UserRepository {
  abstract createUser(newUser: InterfaceUser): Promise<PublicInterfaceUser>;
  abstract getAllUsers(): Promise<PublicInterfaceUser[]>;
  abstract getById(username: string): Promise<InterfaceUser>;
  abstract getByEmail(email: string): Promise<InterfaceUser>;
  abstract deleteUser(id: string): Promise<void>;
}
