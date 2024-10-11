export interface OfficershipMembership {
  OfficershipMembershipID?: number;
  UserID: number;
  OrganizationName: string;
  OrganizationAddress?: string;
  Position?: string;
  Level?: 'Local' | 'National' | 'International';
  Classification?: 'Learning and Development Interventions' | 'Training Programs' | 'Seminars' | 'Conferences' | 'Others';
  InclusiveDatesFrom?: string;
  InclusiveDatesTo?: string;
  Remarks?: string;
  SupportingDocument?: string;
  Proof?: string;
  ProofType?: 'file' | 'link';
}
