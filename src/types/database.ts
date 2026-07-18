/**
 * Lightweight Database typing for Studio D Supabase tables.
 * Replace with `supabase gen types` output once the remote schema is applied.
 */

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
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          price: number;
          compare_at_price: number | null;
          category: string;
          images: string[];
          tags: string[];
          featured: boolean;
          is_active: boolean;
          materials: string[];
          dimensions: string | null;
          stock_count: number;
          created_at: string;
        };
        Insert: {
          id: string;
          slug: string;
          name: string;
          description: string;
          price: number;
          compare_at_price?: number | null;
          category: string;
          images?: string[];
          tags?: string[];
          featured?: boolean;
          is_active?: boolean;
          materials?: string[];
          dimensions?: string | null;
          stock_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string;
          price?: number;
          compare_at_price?: number | null;
          category?: string;
          images?: string[];
          tags?: string[];
          featured?: boolean;
          is_active?: boolean;
          materials?: string[];
          dimensions?: string | null;
          stock_count?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
          total?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price_at_purchase: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price_at_purchase: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price_at_purchase?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
