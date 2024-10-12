export interface TrainingSeminar {
  TrainingID?: number;
  UserID: number;
  Title: string;
  Classification?: string;
  Nature?: string;
  Budget?: number;
  SourceOfFund?: string;
  Organizer?: string;
  Level?: string;
  Venue?: string;
  DateFrom: Date;
  DateTo: Date;
  NumberOfHours?: number;
  SupportingDocuments?: string;
  Proof?: string;
  ProofType?: 'file' | 'link';
}
