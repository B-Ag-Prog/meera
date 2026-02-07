export enum AppStage {
  ENTER = 'ENTER',
  INTRO = 'INTRO',
  TITLE = 'TITLE',
  STORY = 'STORY',
  RITUAL = 'RITUAL',
  REVEAL = 'REVEAL',
  DECISION = 'DECISION',
  ENDING_YES = 'ENDING_YES',
  ENDING_NO = 'ENDING_NO'
}

export interface AudioState {
  muted: boolean;
  intensity: number; // 0 to 1
}

export interface RitualSymbol {
  id: number;
  char: string;
  label: string;
  isCorrect: boolean;
}