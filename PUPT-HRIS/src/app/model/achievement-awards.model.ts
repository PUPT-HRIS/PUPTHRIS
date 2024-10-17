export interface AchievementAward {
  AchievementID?: number;
  UserID: number;
  NatureOfAchievement: string;
  Classification: string;
  Level: string;
  AwardingBody: string;
  Venue?: string;
  InclusiveDates?: string;
  Remarks?: string;
  SupportingDocument?: string;
  Proof?: string;
  ProofType?: 'file' | 'link';
}
