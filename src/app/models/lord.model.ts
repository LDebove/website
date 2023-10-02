export interface Race {
  id: number;
  name: string;
};

export interface Faction {
  id: number;
  name: string;
};

export interface Lord {
  id: number;
  name: string;
  faction: Faction;
  race: Race;
  done: boolean;
};
