export interface Stage {
  Id: number;
  OrderId: number;
  StageName: string;
  Status: string;
  StartedAt: string;
  CompletedAt?: string;
  Notes: string;
}
