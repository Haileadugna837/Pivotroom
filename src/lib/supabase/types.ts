export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
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
            referencedRelation: "expert_public_profiles"
            referencedColumns: ["id"]
          },
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
          parent_id: string | null
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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
      expert_invites: {
        Row: {
          completed_at: string | null
          created_at: string
          email: string
          id: string
          invited_by: string | null
          status: string
          token: string
          used_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          status?: string
          token: string
          used_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          status?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      expert_ngo_allocations: {
        Row: {
          created_at: string
          expert_id: string
          id: string
          ngo_id: string
          percentage: number
        }
        Insert: {
          created_at?: string
          expert_id: string
          id?: string
          ngo_id: string
          percentage: number
        }
        Update: {
          created_at?: string
          expert_id?: string
          id?: string
          ngo_id?: string
          percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "expert_ngo_allocations_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_ngo_allocations_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
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
            referencedRelation: "expert_public_profiles"
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
      expert_profile_views: {
        Row: {
          expert_id: string
          id: string
          viewed_at: string
        }
        Insert: {
          expert_id: string
          id?: string
          viewed_at?: string
        }
        Update: {
          expert_id?: string
          id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_profile_views_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_social_links: {
        Row: {
          created_at: string
          expert_id: string
          id: string
          platform: string
          url: string
        }
        Insert: {
          created_at?: string
          expert_id: string
          id?: string
          platform: string
          url: string
        }
        Update: {
          created_at?: string
          expert_id?: string
          id?: string
          platform?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_social_links_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
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
          payout_account_name: string | null
          payout_account_number: string | null
          photo_url: string | null
          price_per_15_min: number | null
          status: string
        }
        Insert: {
          bio?: string | null
          category_id?: string | null
          created_at?: string
          currency?: string
          headline?: string | null
          id: string
          payout_account_name?: string | null
          payout_account_number?: string | null
          photo_url?: string | null
          price_per_15_min?: number | null
          status?: string
        }
        Update: {
          bio?: string | null
          category_id?: string | null
          created_at?: string
          currency?: string
          headline?: string | null
          id?: string
          payout_account_name?: string | null
          payout_account_number?: string | null
          photo_url?: string | null
          price_per_15_min?: number | null
          status?: string
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
            referencedRelation: "expert_public_profiles"
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
      ngos: {
        Row: {
          created_at: string
          id: string
          legal_license_url: string | null
          logo_url: string | null
          name: string
          payout_account_name: string | null
          payout_account_number: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          legal_license_url?: string | null
          logo_url?: string | null
          name: string
          payout_account_name?: string | null
          payout_account_number?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          legal_license_url?: string | null
          logo_url?: string | null
          name?: string
          payout_account_name?: string | null
          payout_account_number?: string | null
        }
        Relationships: []
      }
      nominations: {
        Row: {
          created_at: string
          id: string
          links: string[]
          nominator_id: string
          nominee_id: string
          reason: string
        }
        Insert: {
          created_at?: string
          id?: string
          links?: string[]
          nominator_id: string
          nominee_id: string
          reason: string
        }
        Update: {
          created_at?: string
          id?: string
          links?: string[]
          nominator_id?: string
          nominee_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "nominations_nominee_id_fkey"
            columns: ["nominee_id"]
            isOneToOne: false
            referencedRelation: "nominees"
            referencedColumns: ["id"]
          },
        ]
      }
      nominees: {
        Row: {
          created_at: string
          id: string
          name: string
          resolved_expert_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          resolved_expert_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          resolved_expert_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "nominees_resolved_expert_id_fkey"
            columns: ["resolved_expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          id: string
          path: string
          viewed_at: string
        }
        Insert: {
          id?: string
          path: string
          viewed_at?: string
        }
        Update: {
          id?: string
          path?: string
          viewed_at?: string
        }
        Relationships: []
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
            referencedRelation: "expert_public_profiles"
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
          account_status: string
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
        }
        Insert: {
          account_status?: string
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: string
        }
        Update: {
          account_status?: string
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
          hidden: boolean
          id: string
          rating: number
        }
        Insert: {
          booking_id: string
          client_id: string
          comment?: string | null
          created_at?: string
          expert_id: string
          hidden?: boolean
          id?: string
          rating: number
        }
        Update: {
          booking_id?: string
          client_id?: string
          comment?: string | null
          created_at?: string
          expert_id?: string
          hidden?: boolean
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
            referencedRelation: "expert_public_profiles"
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
      wishlists: {
        Row: {
          created_at: string
          expert_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expert_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expert_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_expert_id_fkey"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
