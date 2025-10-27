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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
          is_verified: boolean | null
          name: string | null
          password_hash: string | null
          personal_email: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          is_verified?: boolean | null
          name?: string | null
          password_hash?: string | null
          personal_email?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string | null
          is_verified?: boolean | null
          name?: string | null
          password_hash?: string | null
          personal_email?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          absent_reason: string | null
          created_at: string | null
          date: string | null
          id: string | null
          marked_at: string | null
          marked_by: string | null
          status: string | null
          stream_id: string | null
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          absent_reason?: string | null
          created_at?: string | null
          date?: string | null
          id?: string | null
          marked_at?: string | null
          marked_by?: string | null
          status?: string | null
          stream_id?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          absent_reason?: string | null
          created_at?: string | null
          date?: string | null
          id?: string | null
          marked_at?: string | null
          marked_by?: string | null
          status?: string | null
          stream_id?: string | null
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      classes: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      electoral_applications: {
        Row: {
          age: number | null
          class_name: string | null
          class_teacher_name: string | null
          class_teacher_tel: string | null
          created_at: string | null
          id: string
          parent_name: string | null
          parent_tel: number | null
          position: string | null
          sex: string | null
          status: string | null
          stream_name: string | null
          student_email: string | null
          student_id: string | null
          student_name: string | null
          student_photo: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          class_name?: string | null
          class_teacher_name?: string | null
          class_teacher_tel?: string | null
          created_at?: string | null
          id?: string
          parent_name?: string | null
          parent_tel?: number | null
          position?: string | null
          sex?: string | null
          status?: string | null
          stream_name?: string | null
          student_email?: string | null
          student_id?: string | null
          student_name?: string | null
          student_photo?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          class_name?: string | null
          class_teacher_name?: string | null
          class_teacher_tel?: string | null
          created_at?: string | null
          id?: string
          parent_name?: string | null
          parent_tel?: number | null
          position?: string | null
          sex?: string | null
          status?: string | null
          stream_name?: string | null
          student_email?: string | null
          student_id?: string | null
          student_name?: string | null
          student_photo?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      electoral_positions: {
        Row: {
          created_at: string | null
          description: string | null
          eligible_classes: Json | null
          id: string | null
          is_active: boolean | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          eligible_classes?: Json | null
          id?: string | null
          is_active?: boolean | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          eligible_classes?: Json | null
          id?: string | null
          is_active?: boolean | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      electoral_votes: {
        Row: {
          average_mouse_speed: number | null
          battery_charging: boolean | null
          battery_level: number | null
          behavior_signature: string | null
          browser: string | null
          candidate_id: string
          candidate_name: string
          canvas_fingerprint: string | null
          click_count: number | null
          created_at: string | null
          device_type: string | null
          id: string
          installed_fonts: string | null
          ip_address: string | null
          language: string | null
          latitude: number | null
          location_accuracy: number | null
          longitude: number | null
          mouse_movement_count: number | null
          os: string | null
          position: string
          screen_resolution: string | null
          timezone: string | null
          typing_speed: number | null
          vote_status: string | null
          voted_at: string | null
          voter_id: string
          voter_name: string
          webgl_fingerprint: string | null
        }
        Insert: {
          average_mouse_speed?: number | null
          battery_charging?: boolean | null
          battery_level?: number | null
          behavior_signature?: string | null
          browser?: string | null
          candidate_id: string
          candidate_name: string
          canvas_fingerprint?: string | null
          click_count?: number | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          installed_fonts?: string | null
          ip_address?: string | null
          language?: string | null
          latitude?: number | null
          location_accuracy?: number | null
          longitude?: number | null
          mouse_movement_count?: number | null
          os?: string | null
          position: string
          screen_resolution?: string | null
          timezone?: string | null
          typing_speed?: number | null
          vote_status?: string | null
          voted_at?: string | null
          voter_id: string
          voter_name: string
          webgl_fingerprint?: string | null
        }
        Update: {
          average_mouse_speed?: number | null
          battery_charging?: boolean | null
          battery_level?: number | null
          behavior_signature?: string | null
          browser?: string | null
          candidate_id?: string
          candidate_name?: string
          canvas_fingerprint?: string | null
          click_count?: number | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          installed_fonts?: string | null
          ip_address?: string | null
          language?: string | null
          latitude?: number | null
          location_accuracy?: number | null
          longitude?: number | null
          mouse_movement_count?: number | null
          os?: string | null
          position?: string
          screen_resolution?: string | null
          timezone?: string | null
          typing_speed?: number | null
          vote_status?: string | null
          voted_at?: string | null
          voter_id?: string
          voter_name?: string
          webgl_fingerprint?: string | null
        }
        Relationships: []
      }
      streams: {
        Row: {
          class_id: string | null
          created_at: string | null
          id: string | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          id?: string | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          class_id: string | null
          created_at: string | null
          default_password: string | null
          email: string | null
          gender: string | null
          id: string | null
          is_active: boolean | null
          is_verified: boolean | null
          name: string | null
          password_hash: string | null
          personal_email: string | null
          photo_url: string | null
          stream_id: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          default_password?: string | null
          email?: string | null
          gender?: string | null
          id?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          name?: string | null
          password_hash?: string | null
          personal_email?: string | null
          photo_url?: string | null
          stream_id?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          default_password?: string | null
          email?: string | null
          gender?: string | null
          id?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          name?: string | null
          password_hash?: string | null
          personal_email?: string | null
          photo_url?: string | null
          stream_id?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          classesTaught: string | null
          contactNumber: number | null
          created_at: string | null
          default_password: number | null
          email: string | null
          id: string | null
          is_verified: boolean | null
          name: string | null
          nationality: string | null
          password_hash: string | null
          personal_email: string | null
          photo: string | null
          photo_url: string | null
          sex: string | null
          subjectsTaught: string | null
          updated_at: string | null
        }
        Insert: {
          classesTaught?: string | null
          contactNumber?: number | null
          created_at?: string | null
          default_password?: number | null
          email?: string | null
          id?: string | null
          is_verified?: boolean | null
          name?: string | null
          nationality?: string | null
          password_hash?: string | null
          personal_email?: string | null
          photo?: string | null
          photo_url?: string | null
          sex?: string | null
          subjectsTaught?: string | null
          updated_at?: string | null
        }
        Update: {
          classesTaught?: string | null
          contactNumber?: number | null
          created_at?: string | null
          default_password?: number | null
          email?: string | null
          id?: string | null
          is_verified?: boolean | null
          name?: string | null
          nationality?: string | null
          password_hash?: string | null
          personal_email?: string | null
          photo?: string | null
          photo_url?: string | null
          sex?: string | null
          subjectsTaught?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
