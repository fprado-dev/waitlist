export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined; }
  | Json[];

export interface Database {
  public: {
    Tables: {
      waitlist: {
        Row: {
          id: number;
          created_at: string;
          email: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          email?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          email?: string | null;
        };
      };
    };
  };
}