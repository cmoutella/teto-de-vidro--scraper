import { InterfaceHunt } from '../schemas/models/hunt.interface';

export abstract class HuntRepository {
  abstract getAllHuntsByUser(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<InterfaceHunt[]>;

  abstract getOneHuntById(id: string): Promise<InterfaceHunt>;

  abstract createHunt(newHunt: InterfaceHunt): Promise<InterfaceHunt | null>;

  abstract updateHunt(
    id: string,
    data: Partial<InterfaceHunt>,
  ): Promise<InterfaceHunt>;

  abstract addTargetToHunt(huntId: string, targetId: string): Promise<void>;

  abstract removeTargetFromHunt(
    huntId: string,
    targetId: string,
  ): Promise<void>;

  abstract deleteHunt(id: string): Promise<void>;
}
