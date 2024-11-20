export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type SupabaseSchema = {
    public: {
        Tables: {
            birthdays: {
                Row: {
                    created_at: string;
                    date: string;
                    id: number;
                    name: string;
                    observation: string | null;
                    relationship: string;
                    updated_at: string | null;
                    user_id: string;
                };
                Insert: {
                    created_at?: string;
                    date: string;
                    id?: number;
                    name: string;
                    observation?: string | null;
                    relationship: string;
                    updated_at?: string | null;
                    user_id: string;
                };
                Update: {
                    created_at?: string;
                    date?: string;
                    id?: number;
                    name?: string;
                    observation?: string | null;
                    relationship?: string;
                    updated_at?: string | null;
                    user_id?: string;
                };
                Relationships: [];
            };
            recommended_gifts: {
                Row: {
                    birthday_id: number;
                    created_at: string;
                    description: string;
                    id: number;
                    name: string;
                    updated_at: string | null;
                };
                Insert: {
                    birthday_id: number;
                    created_at?: string;
                    description: string;
                    id?: number;
                    name: string;
                    updated_at?: string | null;
                };
                Update: {
                    birthday_id?: number;
                    created_at?: string;
                    description?: string;
                    id?: number;
                    name?: string;
                    updated_at?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "recommended_gifts_birthday_id_fkey";
                        columns: ["birthday_id"];
                        isOneToOne: false;
                        referencedRelation: "birthdays";
                        referencedColumns: ["id"];
                    },
                ];
            };
            users: {
                Row: {
                    email: string | null;
                    id: string;
                    image: string | null;
                    name: string | null;
                };
                Insert: {
                    email?: string | null;
                    id: string;
                    image?: string | null;
                    name?: string | null;
                };
                Update: {
                    email?: string | null;
                    id?: string;
                    image?: string | null;
                    name?: string | null;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type PublicSchema = SupabaseSchema[Extract<keyof SupabaseSchema, "public">];

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof SupabaseSchema },
    TableName extends PublicTableNameOrOptions extends
        { schema: keyof SupabaseSchema } ? keyof (
            & SupabaseSchema[PublicTableNameOrOptions["schema"]]["Tables"]
            & SupabaseSchema[PublicTableNameOrOptions["schema"]]["Views"]
        )
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof SupabaseSchema } ? (
        & SupabaseSchema[PublicTableNameOrOptions["schema"]]["Tables"]
        & SupabaseSchema[PublicTableNameOrOptions["schema"]]["Views"]
    )[TableName] extends {
        Row: infer R;
    } ? R
    : never
    : PublicTableNameOrOptions extends keyof (
        & PublicSchema["Tables"]
        & PublicSchema["Views"]
    ) ? (
            & PublicSchema["Tables"]
            & PublicSchema["Views"]
        )[PublicTableNameOrOptions] extends {
            Row: infer R;
        } ? R
        : never
    : never;

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof SupabaseSchema },
    TableName extends PublicTableNameOrOptions extends
        { schema: keyof SupabaseSchema }
        ? keyof SupabaseSchema[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof SupabaseSchema }
    ? SupabaseSchema[PublicTableNameOrOptions["schema"]]["Tables"][
        TableName
    ] extends {
        Insert: infer I;
    } ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Insert: infer I;
        } ? I
        : never
    : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof SupabaseSchema },
    TableName extends PublicTableNameOrOptions extends
        { schema: keyof SupabaseSchema }
        ? keyof SupabaseSchema[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof SupabaseSchema }
    ? SupabaseSchema[PublicTableNameOrOptions["schema"]]["Tables"][
        TableName
    ] extends {
        Update: infer U;
    } ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
        ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Update: infer U;
        } ? U
        : never
    : never;

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof PublicSchema["Enums"]
        | { schema: keyof SupabaseSchema },
    EnumName extends PublicEnumNameOrOptions extends
        { schema: keyof SupabaseSchema }
        ? keyof SupabaseSchema[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof SupabaseSchema }
    ? SupabaseSchema[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
        ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof PublicSchema["CompositeTypes"]
        | { schema: keyof SupabaseSchema },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof SupabaseSchema;
    } ? keyof SupabaseSchema[PublicCompositeTypeNameOrOptions["schema"]][
            "CompositeTypes"
        ]
        : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof SupabaseSchema }
    ? SupabaseSchema[PublicCompositeTypeNameOrOptions["schema"]][
        "CompositeTypes"
    ][
        CompositeTypeName
    ]
    : PublicCompositeTypeNameOrOptions extends
        keyof PublicSchema["CompositeTypes"]
        ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
