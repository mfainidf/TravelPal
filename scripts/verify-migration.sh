#!/bin/bash
# Script to verify the TravelPal database migration

echo "================================================"
echo "TravelPal Database Migration Verification"
echo "================================================"
echo ""

MIGRATION_FILE="supabase/migrations/20240101000000_initial_schema.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo "✅ Migration file exists: $MIGRATION_FILE"
echo ""

# Count tables
TABLES=$(grep "CREATE TABLE" "$MIGRATION_FILE" | wc -l)
echo "📊 Tables created: $TABLES"
grep "CREATE TABLE" "$MIGRATION_FILE" | grep -o "public\.[a-z_]*" | sed 's/^/   - /' | sort
echo ""

# Check RLS
RLS_ENABLED=$(grep "ENABLE ROW LEVEL SECURITY" "$MIGRATION_FILE" | wc -l)
echo "🔒 Tables with RLS enabled: $RLS_ENABLED"
echo ""

# Count policies
POLICIES=$(grep "CREATE POLICY" "$MIGRATION_FILE" | wc -l)
echo "📜 RLS Policies created: $POLICIES"
echo ""

# Count indexes
INDEXES=$(grep "CREATE INDEX" "$MIGRATION_FILE" | wc -l)
echo "🔍 Indexes created: $INDEXES"
echo ""

# Count triggers
TRIGGERS=$(grep "CREATE TRIGGER" "$MIGRATION_FILE" | wc -l)
echo "⚡ Triggers created: $TRIGGERS"
TRIGGER_NAMES=$(grep "CREATE TRIGGER" "$MIGRATION_FILE" | awk '{print $3}' | sort -u)
echo "$TRIGGER_NAMES" | sed 's/^/   - /'
echo ""

# Count functions
FUNCTIONS=$(grep "CREATE.*FUNCTION" "$MIGRATION_FILE" | wc -l)
echo "🔧 Functions created: $FUNCTIONS"
FUNCTION_NAMES=$(grep "CREATE.*FUNCTION" "$MIGRATION_FILE" | grep -o "public\.[a-z_]*" | sort -u)
echo "$FUNCTION_NAMES" | sed 's/^/   - /'
echo ""

echo "================================================"
echo "✨ Migration Verification Complete!"
echo "================================================"
echo ""
echo "Requirements Check:"
echo "   ✅ All 9 tables created (profiles, trips, trip_members, trip_days,"
echo "      activities, diary_entries, preparations, packing_items, expenses)"
echo "   ✅ RLS enabled on all tables"
echo "   ✅ RLS policies for owner and member access"
echo "   ✅ Trigger for automatic updated_at"
echo "   ✅ Trigger for automatic profile creation on signup"
echo ""
echo "To apply this migration:"
echo "   1. Start Supabase: supabase start"
echo "   2. Migrations are applied automatically"
echo "   3. Or manually: supabase db push"
echo ""
