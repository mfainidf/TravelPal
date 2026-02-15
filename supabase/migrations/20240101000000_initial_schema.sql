-- TravelPal Database Schema
-- Complete schema with all tables, RLS policies, and triggers

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Trips table
CREATE TABLE public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    destination TEXT,
    start_date DATE,
    end_date DATE,
    cover_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Trip members table (for shared trips)
CREATE TABLE public.trip_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'editor', 'viewer', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(trip_id, user_id)
);

-- Trip days table (daily itinerary)
CREATE TABLE public.trip_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    day_date DATE NOT NULL,
    title TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    UNIQUE(trip_id, day_date)
);

-- Activities table (activities planned for each day)
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_day_id UUID NOT NULL REFERENCES public.trip_days(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    start_time TIME,
    end_time TIME,
    activity_type TEXT,
    cost DECIMAL(10, 2),
    booking_reference TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Diary entries table (travel journal)
CREATE TABLE public.diary_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    entry_date DATE NOT NULL,
    mood TEXT,
    photos JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Preparations table (pre-trip checklist)
CREATE TABLE public.preparations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    due_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Packing items table (packing list)
CREATE TABLE public.packing_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER DEFAULT 1,
    is_packed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Expenses table (trip budget tracking)
CREATE TABLE public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    category TEXT,
    expense_date DATE NOT NULL,
    notes TEXT,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_trips_owner_id ON public.trips(owner_id);
CREATE INDEX idx_trip_members_trip_id ON public.trip_members(trip_id);
CREATE INDEX idx_trip_members_user_id ON public.trip_members(user_id);
CREATE INDEX idx_trip_days_trip_id ON public.trip_days(trip_id);
CREATE INDEX idx_activities_trip_day_id ON public.activities(trip_day_id);
CREATE INDEX idx_diary_entries_trip_id ON public.diary_entries(trip_id);
CREATE INDEX idx_diary_entries_user_id ON public.diary_entries(user_id);
CREATE INDEX idx_preparations_trip_id ON public.preparations(trip_id);
CREATE INDEX idx_packing_items_trip_id ON public.packing_items(trip_id);
CREATE INDEX idx_expenses_trip_id ON public.expenses(trip_id);
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preparations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - PROFILES
-- ============================================================================

-- Profiles: Users can view all profiles
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

-- Profiles: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Profiles: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- RLS POLICIES - TRIPS
-- ============================================================================

-- Trips: Users can view trips they own or are members of
CREATE POLICY "Users can view own trips and trips they are members of"
    ON public.trips FOR SELECT
    USING (
        auth.uid() = owner_id 
        OR EXISTS (
            SELECT 1 FROM public.trip_members 
            WHERE trip_members.trip_id = trips.id 
            AND trip_members.user_id = auth.uid()
        )
    );

-- Trips: Users can create trips
CREATE POLICY "Users can create trips"
    ON public.trips FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- Trips: Owners and editors can update trips
CREATE POLICY "Owners and editors can update trips"
    ON public.trips FOR UPDATE
    USING (
        auth.uid() = owner_id 
        OR EXISTS (
            SELECT 1 FROM public.trip_members 
            WHERE trip_members.trip_id = trips.id 
            AND trip_members.user_id = auth.uid() 
            AND trip_members.role IN ('owner', 'editor')
        )
    );

-- Trips: Only owners can delete trips
CREATE POLICY "Only owners can delete trips"
    ON public.trips FOR DELETE
    USING (auth.uid() = owner_id);

-- ============================================================================
-- RLS POLICIES - TRIP_MEMBERS
-- ============================================================================

-- Trip members: Users can view members of trips they belong to
CREATE POLICY "Users can view members of their trips"
    ON public.trip_members FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = trip_members.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members tm 
                    WHERE tm.trip_id = trips.id 
                    AND tm.user_id = auth.uid()
                )
            )
        )
    );

-- Trip members: Owners can add members
CREATE POLICY "Owners can add members"
    ON public.trip_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = trip_members.trip_id 
            AND trips.owner_id = auth.uid()
        )
    );

-- Trip members: Owners can update member roles
CREATE POLICY "Owners can update member roles"
    ON public.trip_members FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = trip_members.trip_id 
            AND trips.owner_id = auth.uid()
        )
    );

-- Trip members: Owners can remove members, members can remove themselves
CREATE POLICY "Owners can remove members, members can remove themselves"
    ON public.trip_members FOR DELETE
    USING (
        trip_members.user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = trip_members.trip_id 
            AND trips.owner_id = auth.uid()
        )
    );

-- ============================================================================
-- RLS POLICIES - TRIP_DAYS
-- ============================================================================

-- Trip days: Users can view days of trips they belong to
CREATE POLICY "Users can view trip days of their trips"
    ON public.trip_days FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = trip_days.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid()
                )
            )
        )
    );

-- Trip days: Members can create days
CREATE POLICY "Members can create trip days"
    ON public.trip_days FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = trip_days.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid() 
                    AND trip_members.role IN ('owner', 'editor', 'member')
                )
            )
        )
    );

-- Trip days: Members can update days
CREATE POLICY "Members can update trip days"
    ON public.trip_days FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = trip_days.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid() 
                    AND trip_members.role IN ('owner', 'editor', 'member')
                )
            )
        )
    );

-- Trip days: Owners and editors can delete days
CREATE POLICY "Owners and editors can delete trip days"
    ON public.trip_days FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = trip_days.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid() 
                    AND trip_members.role IN ('owner', 'editor')
                )
            )
        )
    );

-- ============================================================================
-- RLS POLICIES - ACTIVITIES
-- ============================================================================

-- Activities: Users can view activities of trips they belong to
CREATE POLICY "Users can view activities of their trips"
    ON public.activities FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trip_days 
            INNER JOIN public.trips ON trips.id = trip_days.trip_id
            WHERE trip_days.id = activities.trip_day_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid()
                )
            )
        )
    );

-- Activities: Members can create activities
CREATE POLICY "Members can create activities"
    ON public.activities FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trip_days 
            INNER JOIN public.trips ON trips.id = trip_days.trip_id
            WHERE trip_days.id = activities.trip_day_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid() 
                    AND trip_members.role IN ('owner', 'editor', 'member')
                )
            )
        )
    );

-- Activities: Members can update activities
CREATE POLICY "Members can update activities"
    ON public.activities FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.trip_days 
            INNER JOIN public.trips ON trips.id = trip_days.trip_id
            WHERE trip_days.id = activities.trip_day_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid() 
                    AND trip_members.role IN ('owner', 'editor', 'member')
                )
            )
        )
    );

-- Activities: Owners and editors can delete activities
CREATE POLICY "Owners and editors can delete activities"
    ON public.activities FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.trip_days 
            INNER JOIN public.trips ON trips.id = trip_days.trip_id
            WHERE trip_days.id = activities.trip_day_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid() 
                    AND trip_members.role IN ('owner', 'editor')
                )
            )
        )
    );

-- ============================================================================
-- RLS POLICIES - DIARY_ENTRIES
-- ============================================================================

-- Diary entries: Users can view entries of trips they belong to
CREATE POLICY "Users can view diary entries of their trips"
    ON public.diary_entries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = diary_entries.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid()
                )
            )
        )
    );

-- Diary entries: Users can create entries for their trips
CREATE POLICY "Users can create diary entries for their trips"
    ON public.diary_entries FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = diary_entries.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid()
                )
            )
        )
    );

-- Diary entries: Users can update their own entries
CREATE POLICY "Users can update their own diary entries"
    ON public.diary_entries FOR UPDATE
    USING (auth.uid() = user_id);

-- Diary entries: Users can delete their own entries
CREATE POLICY "Users can delete their own diary entries"
    ON public.diary_entries FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- RLS POLICIES - PREPARATIONS
-- ============================================================================

-- Preparations: Users can view preparations of trips they belong to
CREATE POLICY "Users can view preparations of their trips"
    ON public.preparations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = preparations.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid()
                )
            )
        )
    );

-- Preparations: Members can create preparations
CREATE POLICY "Members can create preparations"
    ON public.preparations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = preparations.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid() 
                    AND trip_members.role IN ('owner', 'editor', 'member')
                )
            )
        )
    );

-- Preparations: Members can update preparations
CREATE POLICY "Members can update preparations"
    ON public.preparations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = preparations.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid() 
                    AND trip_members.role IN ('owner', 'editor', 'member')
                )
            )
        )
    );

-- Preparations: Owners and editors can delete preparations
CREATE POLICY "Owners and editors can delete preparations"
    ON public.preparations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = preparations.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid() 
                    AND trip_members.role IN ('owner', 'editor')
                )
            )
        )
    );

-- ============================================================================
-- RLS POLICIES - PACKING_ITEMS
-- ============================================================================

-- Packing items: Users can view items of trips they belong to
CREATE POLICY "Users can view packing items of their trips"
    ON public.packing_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = packing_items.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid()
                )
            )
        )
    );

-- Packing items: Members can create items
CREATE POLICY "Members can create packing items"
    ON public.packing_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = packing_items.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid() 
                    AND trip_members.role IN ('owner', 'editor', 'member')
                )
            )
        )
    );

-- Packing items: Members can update items
CREATE POLICY "Members can update packing items"
    ON public.packing_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = packing_items.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid() 
                    AND trip_members.role IN ('owner', 'editor', 'member')
                )
            )
        )
    );

-- Packing items: Owners and editors can delete items
CREATE POLICY "Owners and editors can delete packing items"
    ON public.packing_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = packing_items.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid() 
                    AND trip_members.role IN ('owner', 'editor')
                )
            )
        )
    );

-- ============================================================================
-- RLS POLICIES - EXPENSES
-- ============================================================================

-- Expenses: Users can view expenses of trips they belong to
CREATE POLICY "Users can view expenses of their trips"
    ON public.expenses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = expenses.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid()
                )
            )
        )
    );

-- Expenses: Users can create expenses for their trips
CREATE POLICY "Users can create expenses for their trips"
    ON public.expenses FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = expenses.trip_id 
            AND (
                trips.owner_id = auth.uid() 
                OR EXISTS (
                    SELECT 1 FROM public.trip_members 
                    WHERE trip_members.trip_id = trips.id 
                    AND trip_members.user_id = auth.uid()
                )
            )
        )
    );

-- Expenses: Users can update their own expenses
CREATE POLICY "Users can update their own expenses"
    ON public.expenses FOR UPDATE
    USING (auth.uid() = user_id);

-- Expenses: Users can delete their own expenses, owners can delete all
CREATE POLICY "Users can delete their own expenses, owners can delete all"
    ON public.expenses FOR DELETE
    USING (
        auth.uid() = user_id
        OR EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = expenses.trip_id 
            AND trips.owner_id = auth.uid()
        )
    );

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.trips
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.trip_days
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.activities
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.diary_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.preparations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.packing_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile after user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
