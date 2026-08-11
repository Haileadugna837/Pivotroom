export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          calendar_event_id: string | null
          client_id: string
          created_at: string
          currency: string
          end_time: string
          expert_id: string
          id: string
          meet_link: string | null
          price: number | null
          start_time: string
          status: string
        }
        Insert: {
          calendar_event_id?: string | null
          client_id: string
          created_at?: string
          currency?: string
          end_time: string
          expert_id: string
          id?: string
          meet_link?: string | null
          price?: number | null
          start_time: string
          status?: string
        }
        Update: {
          calendar_event_id?: string | null
          client_id?: string
          created_at?: string
          currency?: string
          end_time?: string
          expert_id?: string
          id?: string
          meet_link?: string | null
          price?: number | null
          start_time?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      expert_availability: {
        Row: {
          created_at: string
          date: string
          end_time: string
          expert_id: string
          id: string
          start_time: string
        }
        Insert: {
          created_at?: string
          date: string
          end_time: string
          expert_id: string
          id?: string
          start_time: string
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string
          expert_id?: string
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_availability_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_google_tokens: {
        Row: {
          access_token: string | null
          expert_id: string
          expiry: string | null
          refresh_token: string
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          expert_id: string
          expiry?: string | null
          refresh_token: string
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          expert_id?: string
          expiry?: string | null
          refresh_token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_google_tokens_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: true
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_payouts: {
        Row: {
          amount: number | null
          booking_id: string
          created_at: string
          id: string
          paid_at: string | null
          paid_by: string | null
          status: string
        }
        Insert: {
          amount?: number | null
          booking_id: string
          created_at?: string
          id?: string
          paid_at?: string | null
          paid_by?: string | null
          status?: string
        }
        Update: {
          amount?: number | null
          booking_id?: string
          created_at?: string
          id?: string
          paid_at?: string | null
          paid_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_payouts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_payouts_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experts: {
        Row: {
          bio: string | null
          category_id: string | null
          created_at: string
          currency: string
          headline: string | null
          id: string
          is_approved: boolean
          price_per_15_min: number | null
        }
        Insert: {
          bio?: string | null
          category_id?: string | null
          created_at?: string
          currency?: string
          headline?: string | null
          id: string
          is_approved?: boolean
          price_per_15_min?: number | null
        }
        Update: {
          bio?: string | null
          category_id?: string | null
          created_at?: string
          currency?: string
          headline?: string | null
          id?: string
          is_approved?: boolean
          price_per_15_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "experts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experts_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_proofs: {
        Row: {
          admin_note: string | null
          booking_id: string
          created_at: string
          id: string
          payer_name: string
          payment_date: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          transaction_id: string
        }
        Insert: {
          admin_note?: string | null
          booking_id: string
          created_at?: string
          id?: string
          payer_name: string
          payment_date: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          transaction_id: string
        }
        Update: {
          admin_note?: string | null
          booking_id?: string
          created_at?: string
          id?: string
          payer_name?: string
          payment_date?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_proofs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_proofs_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          client_id: string
          comment: string | null
          created_at: string
          expert_id: string
          id: string
          rating: number
        }
        Insert: {
          booking_id: string
          client_id: string
          comment?: string | null
          created_at?: string
          expert_id: string
          id?: string
          rating: number
        }
        Update: {
          booking_id?: string
          client_id?: string
          comment?: string | null
          created_at?: string
          expert_id?: string
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      expert_public_profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
