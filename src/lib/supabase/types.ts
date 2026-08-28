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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      acquisition_funnel_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          session_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          session_id?: string
        }
        Relationships: []
      }
      acquisition_leads: {
        Row: {
          admin_note: string | null
          categories_requested: string[]
          company: string | null
          created_at: string
          email: string | null
          id: string
          last_session_id: string | null
          name: string
          normalized_phone: string
          problem_text: string | null
          raw_phone: string | null
          referral_code: string
          referred_by_code: string | null
          referrer: string | null
          source_page: string | null
          status: string
          updated_at: string
          urgency: string | null
          user_type: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          admin_note?: string | null
          categories_requested?: string[]
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_session_id?: string | null
          name: string
          normalized_phone: string
          problem_text?: string | null
          raw_phone?: string | null
          referral_code: string
          referred_by_code?: string | null
          referrer?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          urgency?: string | null
          user_type?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          admin_note?: string | null
          categories_requested?: string[]
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_session_id?: string | null
          name?: string
          normalized_phone?: string
          problem_text?: string | null
          raw_phone?: string | null
          referral_code?: string
          referred_by_code?: string | null
          referrer?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          urgency?: string | null
          user_type?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      acquisition_sessions: {
        Row: {
          categories_selected: string[] | null
          completed_at: string | null
          created_at: string
          device_type: string | null
          entry_path: string | null
          id: string
          last_activity_at: string
          lead_id: string | null
          problem_text_draft: string | null
          ref_code: string | null
          referrer: string | null
          session_id: string
          source_page: string | null
          started_at: string
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          categories_selected?: string[] | null
          completed_at?: string | null
          created_at?: string
          device_type?: string | null
          entry_path?: string | null
          id?: string
          last_activity_at?: string
          lead_id?: string | null
          problem_text_draft?: string | null
          ref_code?: string | null
          referrer?: string | null
          session_id: string
          source_page?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          categories_selected?: string[] | null
          completed_at?: string | null
          created_at?: string
          device_type?: string | null
          entry_path?: string | null
          id?: string
          last_activity_at?: string
          lead_id?: string | null
          problem_text_draft?: string | null
          ref_code?: string | null
          referrer?: string | null
          session_id?: string
          source_page?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "acquisition_sessions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "acquisition_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_log: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string
          details: Json | null
          id: string
          target_id: string | null
          target_table: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_table: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          target_id?: string | null
          target_table?: string
        }
        Relationships: []
      }
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
          tagline: string | null
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          tagline?: string | null
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          tagline?: string | null
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
      expert_applications: {
        Row: {
          admin_note: string | null
          applicant_user_id: string | null
          categories_requested: string[]
          created_at: string
          current_company: string | null
          current_role: string | null
          email: string | null
          experience_text: string
          expert_invite_id: string | null
          expertise_topics: string[]
          id: string
          initial_availability: string | null
          instagram_url: string | null
          invited_at: string | null
          linkedin_url: string | null
          name: string
          normalized_phone: string | null
          preferred_price_etb: number | null
          problems_solved_text: string | null
          professional_type: string | null
          professional_type_secondary: string | null
          raw_phone: string | null
          session_id: string | null
          source_page: string | null
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          website_url: string | null
          why_join_text: string | null
          years_experience: number | null
          years_experience_range: string | null
        }
        Insert: {
          admin_note?: string | null
          applicant_user_id?: string | null
          categories_requested?: string[]
          created_at?: string
          current_company?: string | null
          current_role?: string | null
          email?: string | null
          experience_text: string
          expert_invite_id?: string | null
          expertise_topics?: string[]
          id?: string
          initial_availability?: string | null
          instagram_url?: string | null
          invited_at?: string | null
          linkedin_url?: string | null
          name: string
          normalized_phone?: string | null
          preferred_price_etb?: number | null
          problems_solved_text?: string | null
          professional_type?: string | null
          professional_type_secondary?: string | null
          raw_phone?: string | null
          session_id?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          website_url?: string | null
          why_join_text?: string | null
          years_experience?: number | null
          years_experience_range?: string | null
        }
        Update: {
          admin_note?: string | null
          applicant_user_id?: string | null
          categories_requested?: string[]
          created_at?: string
          current_company?: string | null
          current_role?: string | null
          email?: string | null
          experience_text?: string
          expert_invite_id?: string | null
          expertise_topics?: string[]
          id?: string
          initial_availability?: string | null
          instagram_url?: string | null
          invited_at?: string | null
          linkedin_url?: string | null
          name?: string
          normalized_phone?: string | null
          preferred_price_etb?: number | null
          problems_solved_text?: string | null
          professional_type?: string | null
          professional_type_secondary?: string | null
          raw_phone?: string | null
          session_id?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          website_url?: string | null
          why_join_text?: string | null
          years_experience?: number | null
          years_experience_range?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "founding_expert_applications_expert_invite_id_fkey"
            columns: ["expert_invite_id"]
            isOneToOne: false
            referencedRelation: "expert_invites"
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
      expert_bookable_topics: {
        Row: {
          active: boolean
          created_at: string
          description: string
          expert_id: string
          expertise_topic_id: string
          id: string
          industry_id: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          expert_id: string
          expertise_topic_id: string
          id?: string
          industry_id?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          expert_id?: string
          expertise_topic_id?: string
          id?: string
          industry_id?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_bookable_topics_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_bookable_topics_expertise_topic_id_fkey"
            columns: ["expertise_topic_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_bookable_topics_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_categories: {
        Row: {
          category_id: string
          created_at: string
          expert_id: string
          expertise_type: string | null
        }
        Insert: {
          category_id: string
          created_at?: string
          expert_id: string
          expertise_type?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string
          expert_id?: string
          expertise_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_categories_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_finder_sessions: {
        Row: {
          category_id: string | null
          completed_at: string | null
          created_at: string
          device_type: string | null
          id: string
          identity: string | null
          last_activity_at: string
          lead_submitted: boolean
          match_count: number | null
          match_status: string | null
          name: string | null
          phone: string | null
          problem: string | null
          session_id: string
          source_page: string | null
          started_at: string
          status: string
          subcategory_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          completed_at?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          identity?: string | null
          last_activity_at?: string
          lead_submitted?: boolean
          match_count?: number | null
          match_status?: string | null
          name?: string | null
          phone?: string | null
          problem?: string | null
          session_id: string
          source_page?: string | null
          started_at?: string
          status?: string
          subcategory_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          completed_at?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          identity?: string | null
          last_activity_at?: string
          lead_submitted?: boolean
          match_count?: number | null
          match_status?: string | null
          name?: string | null
          phone?: string | null
          problem?: string | null
          session_id?: string
          source_page?: string | null
          started_at?: string
          status?: string
          subcategory_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_finder_sessions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_finder_sessions_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_finder_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "expert_public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_finder_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      expert_industries: {
        Row: {
          created_at: string
          experience_level: string | null
          expert_id: string
          industry_id: string
        }
        Insert: {
          created_at?: string
          experience_level?: string | null
          expert_id: string
          industry_id: string
        }
        Update: {
          created_at?: string
          experience_level?: string | null
          expert_id?: string
          industry_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_industries_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_industries_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
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
      expert_profile_change_requests: {
        Row: {
          change_type: string
          expert_id: string
          id: string
          new_value: Json
          old_value: Json | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string
        }
        Insert: {
          change_type: string
          expert_id: string
          id?: string
          new_value: Json
          old_value?: Json | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
        }
        Update: {
          change_type?: string
          expert_id?: string
          id?: string
          new_value?: Json
          old_value?: Json | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_profile_change_requests_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
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
          created_at: string
          currency: string
          example_questions: string[] | null
          expectations: string[] | null
          headline: string | null
          id: string
          payout_account_name: string | null
          payout_account_number: string | null
          photo_url: string | null
          price_per_15_min: number | null
          primary_category_id: string | null
          secondary_category_id: string | null
          status: string
          timezone: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          currency?: string
          example_questions?: string[] | null
          expectations?: string[] | null
          headline?: string | null
          id: string
          payout_account_name?: string | null
          payout_account_number?: string | null
          photo_url?: string | null
          price_per_15_min?: number | null
          primary_category_id?: string | null
          secondary_category_id?: string | null
          status?: string
          timezone?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          currency?: string
          example_questions?: string[] | null
          expectations?: string[] | null
          headline?: string | null
          id?: string
          payout_account_name?: string | null
          payout_account_number?: string | null
          photo_url?: string | null
          price_per_15_min?: number | null
          primary_category_id?: string | null
          secondary_category_id?: string | null
          status?: string
          timezone?: string
        }
        Relationships: [
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
          {
            foreignKeyName: "experts_primary_category_id_fkey"
            columns: ["primary_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "experts_secondary_category_id_fkey"
            columns: ["secondary_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_logos: {
        Row: {
          created_at: string
          id: string
          link_url: string | null
          logo_url: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          link_url?: string | null
          logo_url: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          link_url?: string | null
          logo_url?: string
          name?: string
        }
        Relationships: []
      }
      industries: {
        Row: {
          active: boolean
          created_at: string
          id: string
          industry_group_id: string
          name: string
          search_keywords: string[]
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          industry_group_id: string
          name: string
          search_keywords?: string[]
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          industry_group_id?: string
          name?: string
          search_keywords?: string[]
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "industries_industry_group_id_fkey"
            columns: ["industry_group_id"]
            isOneToOne: false
            referencedRelation: "industry_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      industry_groups: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
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
          categories_requested: string[]
          company: string | null
          created_at: string
          id: string
          intro_comfort: string | null
          landing_session_id: string | null
          links: string[]
          nominator_email: string | null
          nominator_id: string | null
          nominator_lead_id: string | null
          nominator_name: string | null
          nominator_phone: string | null
          nominator_relationship: string | null
          nominee_id: string
          nominee_location: string | null
          nominee_title: string | null
          reason: string
          social_url: string | null
          source: string
          topic: string | null
        }
        Insert: {
          categories_requested?: string[]
          company?: string | null
          created_at?: string
          id?: string
          intro_comfort?: string | null
          landing_session_id?: string | null
          links?: string[]
          nominator_email?: string | null
          nominator_id?: string | null
          nominator_lead_id?: string | null
          nominator_name?: string | null
          nominator_phone?: string | null
          nominator_relationship?: string | null
          nominee_id: string
          nominee_location?: string | null
          nominee_title?: string | null
          reason: string
          social_url?: string | null
          source?: string
          topic?: string | null
        }
        Update: {
          categories_requested?: string[]
          company?: string | null
          created_at?: string
          id?: string
          intro_comfort?: string | null
          landing_session_id?: string | null
          links?: string[]
          nominator_email?: string | null
          nominator_id?: string | null
          nominator_lead_id?: string | null
          nominator_name?: string | null
          nominator_phone?: string | null
          nominator_relationship?: string | null
          nominee_id?: string
          nominee_location?: string | null
          nominee_title?: string | null
          reason?: string
          social_url?: string | null
          source?: string
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nominations_nominator_lead_id_fkey"
            columns: ["nominator_lead_id"]
            isOneToOne: false
            referencedRelation: "acquisition_leads"
            referencedColumns: ["id"]
          },
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
          description: string | null
          id: string
          name: string | null
          resolved_expert_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          resolved_expert_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
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
      site_settings: {
        Row: {
          acquisition_landing_enabled: boolean
          acquisition_show_experts_enabled: boolean
          featured_logos_enabled: boolean
          id: number
          updated_at: string
        }
        Insert: {
          acquisition_landing_enabled?: boolean
          acquisition_show_experts_enabled?: boolean
          featured_logos_enabled?: boolean
          id?: number
          updated_at?: string
        }
        Update: {
          acquisition_landing_enabled?: boolean
          acquisition_show_experts_enabled?: boolean
          featured_logos_enabled?: boolean
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      taxonomy_suggestions: {
        Row: {
          context_category_id: string | null
          context_industry_group_id: string | null
          created_at: string
          expert_id: string
          id: string
          name: string
          note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          suggestion_type: string
        }
        Insert: {
          context_category_id?: string | null
          context_industry_group_id?: string | null
          created_at?: string
          expert_id: string
          id?: string
          name: string
          note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          suggestion_type: string
        }
        Update: {
          context_category_id?: string | null
          context_industry_group_id?: string | null
          created_at?: string
          expert_id?: string
          id?: string
          name?: string
          note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          suggestion_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "taxonomy_suggestions_context_category_id_fkey"
            columns: ["context_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taxonomy_suggestions_context_industry_group_id_fkey"
            columns: ["context_industry_group_id"]
            isOneToOne: false
            referencedRelation: "industry_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taxonomy_suggestions_expert_id_fkey"
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
