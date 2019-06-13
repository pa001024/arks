export interface EnemyHandbookTable {
  [key: string]: EnemyHandbook;
}

export interface EnemyHandbook {
  enemyId: string;
  enemyIndex: string;
  sortId: number;
  name: string;
  enemyRace: string;
  enemyLevel: string;
  description: string;
  attackType: string;
  endure: string;
  attack: string;
  defence: string;
  resistance: string;
  ability: string;
}
