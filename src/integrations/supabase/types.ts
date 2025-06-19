export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          match_id: string | null
          message_type: string
          sender_id: string | null
          voice_url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          match_id?: string | null
          message_type: string
          sender_id?: string | null
          voice_url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          match_id?: string | null
          message_type?: string
          sender_id?: string | null
          voice_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_transactions: {
        Row: {
          coin_amount: number
          created_at: string | null
          id: string
          reason: string
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          coin_amount: number
          created_at?: string | null
          id?: string
          reason: string
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          coin_amount?: number
          created_at?: string | null
          id?: string
          reason?: string
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: []
      }
      match_pool: {
        Row: {
          created_at: string | null
          id: string
          match_type: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_type: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_type?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          agora_channel_id: string | null
          chat_unlocked: boolean | null
          created_at: string | null
          id: string
          match_type: string
          status: string | null
          updated_at: string | null
          user1_id: string | null
          user1_vibed: boolean | null
          user2_id: string | null
          user2_vibed: boolean | null
        }
        Insert: {
          agora_channel_id?: string | null
          chat_unlocked?: boolean | null
          created_at?: string | null
          id?: string
          match_type: string
          status?: string | null
          updated_at?: string | null
          user1_id?: string | null
          user1_vibed?: boolean | null
          user2_id?: string | null
          user2_vibed?: boolean | null
        }
        Update: {
          agora_channel_id?: string | null
          chat_unlocked?: boolean | null
          created_at?: string | null
          id?: string
          match_type?: string
          status?: string | null
          updated_at?: string | null
          user1_id?: string | null
          user1_vibed?: boolean | null
          user2_id?: string | null
          user2_vibed?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number
          bio: string | null
          coins: number | null
          created_at: string | null
          followers_count: number | null
          following_count: number | null
          gender: string
          id: string
          interest: string
          last_login: string | null
          level: number | null
          mood_tags: string[] | null
          name: string
          profile_picture_url: string | null
          updated_at: string | null
          voice_status_url: string | null
          xp: number | null
        }
        Insert: {
          age: number
          bio?: string | null
          coins?: number | null
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          gender: string
          id: string
          interest: string
          last_login?: string | null
          level?: number | null
          mood_tags?: string[] | null
          name: string
          profile_picture_url?: string | null
          updated_at?: string | null
          voice_status_url?: string | null
          xp?: number | null
        }
        Update: {
          age?: number
          bio?: string | null
          coins?: number | null
          created_at?: string | null
          followers_count?: number | null
          following_count?: number | null
          gender?: string
          id?: string
          interest?: string
          last_login?: string | null
          level?: number | null
          mood_tags?: string[] | null
          name?: string
          profile_picture_url?: string | null
          updated_at?: string | null
          voice_status_url?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      room_participants: {
        Row: {
          has_mic: boolean | null
          id: string
          joined_at: string | null
          role: string | null
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          has_mic?: boolean | null
          id?: string
          joined_at?: string | null
          role?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          has_mic?: boolean | null
          id?: string
          joined_at?: string | null
          role?: string | null
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "voice_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_rooms: {
        Row: {
          agora_channel_id: string
          coin_entry_cost: number | null
          created_at: string | null
          current_participants: number | null
          description: string | null
          host_id: string | null
          id: string
          is_public: boolean | null
          max_participants: number | null
          status: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          agora_channel_id: string
          coin_entry_cost?: number | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          host_id?: string | null
          id?: string
          is_public?: boolean | null
          max_participants?: number | null
          status?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          agora_channel_id?: string
          coin_entry_cost?: number | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          host_id?: string | null
          id?: string
          is_public?: boolean | null
          max_participants?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      weekly_leaderboard: {
        Row: {
          created_at: string | null
          id: string
          rank: number | null
          user_id: string | null
          week_start: string
          xp_earned: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          rank?: number | null
          user_id?: string | null
          week_start: string
          xp_earned?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          rank?: number | null
          user_id?: string | null
          week_start?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      xp_transactions: {
        Row: {
          created_at: string | null
          id: string
          reason: string
          user_id: string | null
          xp_amount: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason: string
          user_id?: string | null
          xp_amount: number
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string
          user_id?: string | null
          xp_amount?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_coins: {
        Args: {
          user_id: string
          coin_amount: number
          transaction_type: string
          reason: string
        }
        Returns: undefined
      }
      update_user_xp: {
        Args: { user_id: string; xp_gain: number; reason: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
