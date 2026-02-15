# TravelPal

A travel companion application built with Supabase.

## Setup

### Prerequisites

- Supabase CLI installed (see installation instructions below)
- A Supabase account (sign up at https://supabase.com)

### Supabase CLI Installation

Install the Supabase CLI on your system:

**Linux:**
```bash
curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | tar -xz
sudo mv supabase /usr/local/bin/
```

**macOS:**
```bash
brew install supabase/tap/supabase
```

**Windows:**
```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Project Configuration

1. **Create a Supabase Project**
   - Go to https://supabase.com/dashboard
   - Create a new project (free tier)
   - Copy your project URL and anon key from Settings > API

2. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```

3. **Edit `.env` file with your Supabase credentials:**
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Enable Authentication Providers**
   - Go to Authentication > Providers in your Supabase dashboard
   - Enable Email authentication (enabled by default)
   - For Google OAuth:
     - Go to Google Cloud Console (https://console.cloud.google.com/)
     - Create OAuth 2.0 credentials
     - Add the credentials to your `.env` file:
       ```
       SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-google-client-id
       SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-google-client-secret
       ```
     - Configure them in your Supabase dashboard

### Local Development

Start the local Supabase development environment:

```bash
supabase start
```

This will start:
- PostgreSQL database on port 54322
- API server on port 54321
- Studio (web interface) on port 54323
- Inbucket (email testing) on port 54324

Stop the local environment:

```bash
supabase stop
```

### Authentication Configuration

The project is configured with:
- **Email Authentication**: Enabled by default
- **Google OAuth**: Configured in `supabase/config.toml`

Authentication settings can be found in `supabase/config.toml` under the `[auth]` section.

## Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/about)
- [Authentication Guide](https://supabase.com/docs/guides/auth)
