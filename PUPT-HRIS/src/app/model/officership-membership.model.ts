export interface OfficershipMembership {
  OfficershipMembershipID?: number;
  UserID: number;
  OrganizationName: string;
  OrganizationAddress?: string;
  Position?: string;
  Level?: 'Local' | 'National' | 'International';
  Classification?: 'Learning and Development Interventions' | 'Training Programs' | 'Seminars' | 'Conferences' | 'Others';
  InclusiveDatesFrom?: Date;
  InclusiveDatesTo?: Date;
  Remarks?: string;
  SupportingDocument?: string;
  Proof?: string;
}
