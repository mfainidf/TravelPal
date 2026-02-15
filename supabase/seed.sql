-- Seed data for testing the TravelPal database schema
-- This file contains sample data for development and testing purposes

-- Note: This seed assumes user IDs from auth.users
-- In production, these would be created through Supabase Auth

-- Sample profiles (these would normally be created by the trigger)
-- INSERT INTO public.profiles (id, email, full_name) VALUES
--   ('user-uuid-1', 'mario.rossi@example.com', 'Mario Rossi'),
--   ('user-uuid-2', 'laura.bianchi@example.com', 'Laura Bianchi');

-- Sample trips
-- INSERT INTO public.trips (id, owner_id, title, description, destination, start_date, end_date) VALUES
--   ('trip-uuid-1', 'user-uuid-1', 'Viaggio in Toscana', 'Un weekend rilassante tra le colline toscane', 'Toscana, Italia', '2024-06-15', '2024-06-17'),
--   ('trip-uuid-2', 'user-uuid-2', 'Avventura nelle Dolomiti', 'Trekking e natura nelle montagne più belle', 'Dolomiti, Italia', '2024-07-20', '2024-07-27');

-- Sample trip members
-- INSERT INTO public.trip_members (trip_id, user_id, role) VALUES
--   ('trip-uuid-1', 'user-uuid-2', 'member');

-- Sample trip days
-- INSERT INTO public.trip_days (id, trip_id, day_date, title, notes) VALUES
--   ('day-uuid-1', 'trip-uuid-1', '2024-06-15', 'Arrivo a Firenze', 'Check-in hotel e passeggiata in centro'),
--   ('day-uuid-2', 'trip-uuid-1', '2024-06-16', 'Tour della campagna', 'Visita a San Gimignano e degustazione vini');

-- Sample activities
-- INSERT INTO public.activities (trip_day_id, title, description, location, start_time, end_time, activity_type, cost) VALUES
--   ('day-uuid-1', 'Check-in Hotel', 'Arrivo in hotel e sistemazione', 'Hotel Medici, Firenze', '15:00', '16:00', 'accommodation', 120.00),
--   ('day-uuid-1', 'Cena tipica', 'Cena in trattoria tradizionale', 'Trattoria Mario, Firenze', '20:00', '22:00', 'dining', 40.00);

-- Sample diary entries
-- INSERT INTO public.diary_entries (trip_id, user_id, title, content, entry_date, mood) VALUES
--   ('trip-uuid-1', 'user-uuid-1', 'Primo giorno magico', 'Finalmente in Toscana! La città è stupenda e il tramonto su Ponte Vecchio è stato indimenticabile.', '2024-06-15', 'excited');

-- Sample preparations
-- INSERT INTO public.preparations (trip_id, title, description, category, due_date, is_completed) VALUES
--   ('trip-uuid-1', 'Prenotare hotel', 'Confermare la prenotazione dell''hotel', 'accommodation', '2024-06-01', true),
--   ('trip-uuid-1', 'Noleggiare auto', 'Prenotare auto a noleggio in aeroporto', 'transportation', '2024-06-10', false);

-- Sample packing items
-- INSERT INTO public.packing_items (trip_id, item_name, category, quantity, is_packed) VALUES
--   ('trip-uuid-1', 'Magliette', 'clothing', 4, true),
--   ('trip-uuid-1', 'Scarpe da trekking', 'footwear', 1, false),
--   ('trip-uuid-1', 'Crema solare', 'toiletries', 1, true);

-- Sample expenses
-- INSERT INTO public.expenses (trip_id, user_id, title, amount, currency, category, expense_date) VALUES
--   ('trip-uuid-1', 'user-uuid-1', 'Hotel Medici - 2 notti', 240.00, 'EUR', 'accommodation', '2024-06-15'),
--   ('trip-uuid-1', 'user-uuid-1', 'Cena Trattoria Mario', 40.00, 'EUR', 'dining', '2024-06-15'),
--   ('trip-uuid-1', 'user-uuid-1', 'Carburante', 35.50, 'EUR', 'transportation', '2024-06-16');
