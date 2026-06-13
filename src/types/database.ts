export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "candidate" | "employer" | "admin";
          full_name: string | null;
          email: string | null;
          avatar_url: string | null;
          signup_country: string | null;
          is_banned: boolean;
          ban_reason: string | null;
          banned_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: "candidate" | "employer" | "admin";
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          signup_country?: string | null;
          is_banned?: boolean;
          ban_reason?: string | null;
          banned_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "candidate" | "employer" | "admin";
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          signup_country?: string | null;
          is_banned?: boolean;
          ban_reason?: string | null;
          banned_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_visits: {
        Row: {
          id: string;
          visitor_id: string;
          country_code: string | null;
          path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          visitor_id: string;
          country_code?: string | null;
          path?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          visitor_id?: string;
          country_code?: string | null;
          path?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      candidate_profiles: {
        Row: {
          user_id: string;
          headline: string | null;
          bio: string | null;
          location: string | null;
          country_code: string | null;
          phone: string | null;
          cv_path: string | null;
          cv_file_name: string | null;
          cv_uploaded_at: string | null;
          linkedin_url: string | null;
          portfolio_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          headline?: string | null;
          bio?: string | null;
          location?: string | null;
          country_code?: string | null;
          phone?: string | null;
          cv_path?: string | null;
          cv_file_name?: string | null;
          cv_uploaded_at?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["candidate_profiles"]["Insert"]>;
        Relationships: [];
      };
      candidate_skills: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          level: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          level?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["candidate_skills"]["Insert"]>;
        Relationships: [];
      };
      candidate_languages: {
        Row: {
          id: string;
          user_id: string;
          language: string;
          proficiency: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          language: string;
          proficiency: string;
        };
        Update: Partial<Database["public"]["Tables"]["candidate_languages"]["Insert"]>;
        Relationships: [];
      };
      candidate_experiences: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          title: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          company: string;
          title: string;
          location?: string | null;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          description?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["candidate_experiences"]["Insert"]>;
        Relationships: [];
      };
      company_profiles: {
        Row: {
          user_id: string;
          company_name: string | null;
          tagline: string | null;
          description: string | null;
          website: string | null;
          logo_url: string | null;
          industry: string | null;
          company_size: string | null;
          headquarters_city: string | null;
          headquarters_country: string | null;
          hiring_in_regions: string | null;
          linkedin_url: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          company_name?: string | null;
          tagline?: string | null;
          description?: string | null;
          website?: string | null;
          logo_url?: string | null;
          industry?: string | null;
          company_size?: string | null;
          headquarters_city?: string | null;
          headquarters_country?: string | null;
          hiring_in_regions?: string | null;
          linkedin_url?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["company_profiles"]["Insert"]>;
        Relationships: [];
      };
      jobs: {
        Row: {
          id: string;
          employer_id: string | null;
          source_type: string;
          external_url: string | null;
          external_source: string | null;
          external_guid: string | null;
          rss_company_name: string | null;
          title: string;
          description: string;
          requirements: string | null;
          employment_type: string;
          experience_level: string;
          remote_type: string;
          location_city: string | null;
          location_country: string | null;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string | null;
          skills: string[];
          languages: string[];
          status: string;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          employer_id?: string | null;
          source_type?: string;
          external_url?: string | null;
          external_source?: string | null;
          external_guid?: string | null;
          rss_company_name?: string | null;
          title: string;
          description: string;
          requirements?: string | null;
          employment_type?: string;
          experience_level?: string;
          remote_type?: string;
          location_city?: string | null;
          location_country?: string | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string | null;
          skills?: string[];
          languages?: string[];
          status?: string;
          published_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>;
        Relationships: [];
      };
      saved_jobs: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          job_id: string;
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["saved_jobs"]["Insert"]>;
        Relationships: [];
      };
      job_alerts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          q: string | null;
          country: string | null;
          employment_type: string | null;
          remote_type: string | null;
          experience_level: string | null;
          skill: string | null;
          salary_min: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name?: string;
          q?: string | null;
          country?: string | null;
          employment_type?: string | null;
          remote_type?: string | null;
          experience_level?: string | null;
          skill?: string | null;
          salary_min?: number | null;
          is_active?: boolean;
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["job_alerts"]["Insert"]>;
        Relationships: [];
      };
      job_applications: {
        Row: {
          id: string;
          job_id: string;
          candidate_id: string;
          status: Database["public"]["Enums"]["application_status"];
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          job_id: string;
          candidate_id: string;
          status?: Database["public"]["Enums"]["application_status"];
          note?: string | null;
        };
        Update: {
          status?: Database["public"]["Enums"]["application_status"];
          note?: string | null;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          employer_id: string;
          candidate_id: string;
          job_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          employer_id: string;
          candidate_id: string;
          job_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["conversations"]["Insert"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          conversation_id: string;
          sender_id: string;
          body: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };
      conversation_reads: {
        Row: {
          conversation_id: string;
          user_id: string;
          last_read_at: string;
        };
        Insert: {
          conversation_id: string;
          user_id: string;
          last_read_at?: string;
        };
        Update: {
          conversation_id?: string;
          user_id?: string;
          last_read_at?: string;
        };
        Relationships: [];
      };
      application_views: {
        Row: {
          application_id: string;
          employer_id: string;
          viewed_at: string;
        };
        Insert: {
          application_id: string;
          employer_id: string;
          viewed_at?: string;
        };
        Update: {
          application_id?: string;
          employer_id?: string;
          viewed_at?: string;
        };
        Relationships: [];
      };
      employer_subscriptions: {
        Row: {
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan_id: string;
          status: string;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          trial_ends_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan_id?: string;
          status?: string;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          trial_ends_at?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["employer_subscriptions"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      ensure_user_profile: {
        Args: Record<string, never>;
        Returns: Database["public"]["Tables"]["profiles"]["Row"];
      };
      ensure_employer_subscription: {
        Args: Record<string, never>;
        Returns: Database["public"]["Tables"]["employer_subscriptions"]["Row"];
      };
      create_oauth_signup_intent: {
        Args: { p_role: Database["public"]["Enums"]["user_role"] };
        Returns: string;
      };
      apply_oauth_signup_role: {
        Args: { p_intent_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      user_role: "candidate" | "employer" | "admin";
      application_status: "pending" | "accepted" | "rejected";
    };
  };
};
