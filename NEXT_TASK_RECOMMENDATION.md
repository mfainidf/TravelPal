# TravelPal - Next Task Recommendation

## 📊 Current Project Status

### ✅ Completed Foundation (Phase 0 & 1)
The project has successfully completed all foundational setup tasks:

**Phase 0 - Setup (ALL COMPLETE)**
- ✓ Expo scaffolding with TypeScript, ESLint, and Prettier
- ✓ Supabase project setup with authentication (Email + Google OAuth)
- ✓ React Native Paper theme with Material Design 3
- ✓ Expo Router navigation (tabs and stack)
- ✓ Complete PostgreSQL database schema with RLS policies and triggers
- ✓ Supabase client configuration with React Query and AsyncStorage persistence
- ✓ i18n framework configured for Italian language
- ✓ Comprehensive TypeScript type definitions for all entities

**Phase 1 - Authentication (ALL COMPLETE)**
- ✓ Login screen with email/password and Google OAuth
- ✓ Registration screen with email/password signup
- ✓ User profile screen with view/edit modes and travel preferences
- ✓ Multi-profile selector with AsyncStorage persistence
- ✓ Auth guard with route protection and redirect flow

### 📂 Work Status
All completed tasks are in **separate feature branches** that have not been merged to main:
- `copilot/scaffold-expo-typescript-eslint-prettier`
- `copilot/setup-supabase-project`
- `copilot/configure-react-native-paper-theme`
- `copilot/configure-expo-router-navigation`
- `copilot/create-complete-db-schema`
- `copilot/setup-supabase-react-query`
- `copilot/setup-i18n-italiano`
- `copilot/define-typescript-types`
- `copilot/add-login-screen-with-oauth`
- `copilot/add-registration-screen`
- `copilot/create-profile-view-edit`
- `copilot/add-user-profile-selector`
- `copilot/add-auth-guard-redirect-flow`

The **main branch** contains only the initial README.

---

## 🎯 RECOMMENDED NEXT TASK

### **Issue #16: S2.1 - Edge Function: suggest-destinations (GPT-4o-mini)**

**Priority:** Alta (High)  
**Phase:** 2 - Destinazione  
**Type:** Backend + AI  
**Estimated Duration:** 1 hour

### Why This Task?

1. **Logical Progression**: With all Phase 0 and Phase 1 tasks complete, Phase 2 is the next natural step in the development roadmap.

2. **Foundation for Phase 2**: This Edge Function is the backend foundation that enables the entire destination selection flow. Other Phase 2 tasks depend on it:
   - S2.2 requires this API to process user prompts
   - S2.4 requires this API to display destination suggestions

3. **High Priority**: Labeled as `priorità:alta` (must-have for MVP)

4. **Clear Scope**: Well-defined backend task with specific requirements

### Task Description

Create a Supabase Edge Function that uses GPT-4o-mini to suggest travel destinations based on user input.

**Inputs:**
- User prompt (text description of travel preferences, e.g., "warm beach destination in Europe for 2 weeks in August")
- User profile preferences (from profiles.travel_preferences JSONB field)

**Outputs:**
- Array of 3 destination suggestions
- Each suggestion includes:
  - City/destination name
  - Country
  - Brief description (why it matches user preferences)
  - Best time to visit
  - Estimated budget range
  - Key attractions/highlights

**Technical Requirements:**
- Use Supabase Edge Functions (Deno runtime)
- Integrate OpenAI GPT-4o-mini API
- Implement proper error handling
- Add authentication check (valid Supabase JWT)
- Return structured JSON response

**Database Schema Reference:**
The `profiles` table already has a `travel_preferences` JSONB field that can be used to personalize suggestions.

---

## 📋 Roadmap After S2.1

Once S2.1 is complete, the recommended sequence is:

### Phase 2 - Destinazione (Issues #16-20)
1. ✓ **S2.1** - Edge Function: suggest-destinations (GPT-4o-mini) ← **NEXT**
2. **S2.2** - Schermata Nuovo Viaggio + form prompt AI
3. **S2.3** - Input destinazione diretta con autocomplete
4. **S2.4** - Card 3 candidati destinazione + mappa
5. **S2.5** - Salvataggio viaggio (draft)

### Phase 3 - Piano Viaggio (Issues #21-26)
Trip planning with itinerary generation using AI

### Phase 4 - Pre-viaggio (Issues #27-29)
Pre-trip preparation features (packing lists, calendar integration)

### Phase 5 - Durante Viaggio (Issues #30-36)
During-trip features (diary, expenses, daily dashboard)

### Phase 6 - Condivisione (Issues #38-39)
Trip sharing and collaboration features

### Phase 7 - Report (Issues #40-43)
Post-trip report generation with AI

### Phase 8 - Test & Deploy (Issues #44-48)
Testing, CI/CD, and beta distribution

---

## 🚀 Implementation Notes for S2.1

### Prerequisites
- Supabase project already configured ✓
- OpenAI API key (needs to be configured as Supabase secret)
- Database schema with profiles table ✓

### Files to Create
- `supabase/functions/suggest-destinations/index.ts`
- `supabase/functions/suggest-destinations/cors.ts` (CORS headers helper)

### API Client Updates Needed
- Add TypeScript types for the API request/response
- Create React Query hook for calling the Edge Function

### Testing Strategy
- Test with various user prompts
- Verify personalization based on user preferences
- Check error handling (invalid input, API failures)
- Validate response structure and data quality

---

## 📊 Project Statistics

- **Total Issues:** 46 open
- **Phases:** 8 (0-7 complete, currently starting Phase 2)
- **Completed Tasks:** ~13 (all in separate branches)
- **High Priority Tasks:** 30
- **Target Milestone:** MVP - Beta Release (Due: Feb 28, 2026)

---

## 💡 Additional Recommendations

### Consider Merging Foundation Work
All Phase 0 and Phase 1 work is complete but exists in separate branches. Consider:
1. Creating a PR to merge the foundation branches into `main` or a `develop` branch
2. This would provide a stable base for future development
3. Allows for proper code review of the foundational work

### Environment Setup
Before starting S2.1, ensure:
- OpenAI API key is available
- Supabase project has Edge Functions enabled
- Local Supabase CLI is configured for testing

### Documentation
As you implement S2.1, consider documenting:
- API endpoint specification
- Example requests/responses
- Error codes and handling
- Rate limiting considerations (OpenAI API costs)

---

## 🎯 Conclusion

**The next task to work on is Issue #16: S2.1 - Edge Function: suggest-destinations**

This task:
- ✅ Follows the logical project progression
- ✅ Is high priority for MVP
- ✅ Has all prerequisites complete
- ✅ Unblocks subsequent Phase 2 frontend tasks
- ✅ Introduces the first AI feature in the app

Start by setting up the Edge Function structure, integrating the OpenAI API, and creating comprehensive tests for various user inputs.
