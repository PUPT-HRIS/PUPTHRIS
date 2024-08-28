export interface OfficershipMembership {
  OfficershipMembershipID?: number;
  UserID?: number;
  OrganizationName: string;
  OrganizationAddress?: string;
  Position?: string;
  Level?: string;
  Classification?: string;
  InclusiveDatesFrom?: Date;
  InclusiveDatesTo?: Date;
  CurrentOfficer?: boolean;
  Remarks?: string;
  SupportingDocument?: string;
  DescriptionSupportingDocument?: string;
  Proof?: string;
}
