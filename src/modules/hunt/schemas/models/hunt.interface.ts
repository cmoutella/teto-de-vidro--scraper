export interface InterfaceHunt {
  id?: string;
  creatorId: string;
  invitedUsers?: string[];
  title?: string;
  type: 'buy' | 'rent' | 'either';
  movingExpected?: string;
  isActive?: boolean;
  livingPeople?: number;
  livingPets?: number;
}
