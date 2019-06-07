export interface HandbookTeamTable {
  [key: string]: Team;
}

export interface Team {
  teamID: number;
  teamSort: number;
  teamName: string;
  color: string;
  teamKey: string;
}
