export interface AdditionalQuestion {
  ResponseID?: number;
  UserID: number;
  Q34a: 'Yes' | 'No';
  Q34a_Details?: string;
  Q34b: 'Yes' | 'No';
  Q34b_Details?: string;
  Q35a: 'Yes' | 'No';
  Q35a_Details?: string;
  Q35b: 'Yes' | 'No';
  Q35b_Details?: string;
  Q35b_DateFiled?: Date;
  Q35b_Status?: string;
  Q36: 'Yes' | 'No';
  Q36_Details?: string;
  Q37a: 'Yes' | 'No';
  Q37a_Details?: string;
  Q37b: 'Yes' | 'No';
  Q37b_Details?: string;
  Q37c: 'Yes' | 'No';
  Q37c_Details?: string;
  Q38: 'Yes' | 'No';
  Q38_Details?: string;
  Q39a: 'Yes' | 'No';
  Q39a_Details?: string;
  Q39b: 'Yes' | 'No';
  Q39b_Details?: string;
}
