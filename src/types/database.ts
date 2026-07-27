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
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          avatar_url?: string | null;
          is_admin?: boolean;
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
          shipping_address: Json | null;
          razorpay_order_id: string | null;
          razorpay_payment_id: string | null;
          needs_manual_review: boolean;
          review_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
          total: number;
          shipping_address?: Json | null;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          needs_manual_review?: boolean;
          review_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
          total?: number;
          shipping_address?: Json | null;
          razorpay_order_id?: string | null;
          razorpay_payment_id?: string | null;
          needs_manual_review?: boolean;
          review_notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey",
            columns: ["user_id"],
            isOneToOne: false,
            referencedRelation: "users",
            referencedColumns: ["id"],
          },
        ];
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
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey",
            columns: ["order_id"],
            isOneToOne: false,
            referencedRelation: "orders",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "order_items_product_id_fkey",
            columns: ["product_id"],
            isOneToOne: false,
            referencedRelation: "products",
            referencedColumns: ["id"],
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string;
          body: string;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string;
          body: string;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          rating?: number;
          title?: string;
          body?: string;
          is_approved?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey",
            columns: ["product_id"],
            isOneToOne: false,
            referencedRelation: "products",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "reviews_user_id_fkey",
            columns: ["user_id"],
            isOneToOne: false,
            referencedRelation: "profiles",
            referencedColumns: ["id"],
          },
        ];
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey",
            columns: ["product_id"],
            isOneToOne: false,
            referencedRelation: "products",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "wishlist_user_id_fkey",
            columns: ["user_id"],
            isOneToOne: false,
            referencedRelation: "profiles",
            referencedColumns: ["id"],
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      decrement_product_stock: {
        Args: {
          p_product_id: string;
          p_quantity: number;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
