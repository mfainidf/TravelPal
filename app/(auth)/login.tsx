import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../../src/services/supabase';
import { spacing } from '../../src/theme/theme';
import { t } from '../../src/i18n';

// Required for OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Validation schema - defined inside component to support dynamic translations
  const loginSchema = z.object({
    email: z.string().min(1, t('auth.login.errors.required')).email(t('auth.login.errors.invalidEmail')),
    password: z.string().min(6, t('auth.login.errors.minPassword')),
  });

  type LoginForm = z.infer<typeof loginSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          Alert.alert('Errore', t('auth.login.errors.invalidCredentials'));
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          Alert.alert('Errore', t('auth.login.errors.networkError'));
        } else {
          Alert.alert('Errore', error.message);
        }
        return;
      }

      // Navigation will be handled by the root layout
    } catch (error: any) {
      Alert.alert('Errore', t('auth.login.errors.unknownError'));
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setGoogleLoading(true);
      const redirectUrl = Linking.createURL('/');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
        },
      });

      if (error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          Alert.alert('Errore', t('auth.login.errors.networkError'));
        } else {
          Alert.alert('Errore', error.message);
        }
        return;
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        
        if (result.type === 'success' && result.url) {
          // Extract the URL fragments and query params
          // OAuth providers return tokens in the URL hash (#access_token=...) 
          // following the OAuth implicit flow convention
          const url = new URL(result.url);
          const params = new URLSearchParams(url.hash.substring(1)); // Remove the '#' and parse
          
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (sessionError) {
              Alert.alert('Errore', sessionError.message);
            }
          }
        }
      }
    } catch (error: any) {
      Alert.alert('Errore', t('auth.login.errors.unknownError'));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.form}>
        <Text variant="headlineLarge" style={styles.title}>
          {t('auth.login.title')}
        </Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label={t('auth.login.email')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                error={!!errors.email}
                style={styles.input}
                mode="outlined"
              />
              {errors.email && (
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email.message}
                </HelperText>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label={t('auth.login.password')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoComplete="password"
                error={!!errors.password}
                style={styles.input}
                mode="outlined"
              />
              {errors.password && (
                <HelperText type="error" visible={!!errors.password}>
                  {errors.password.message}
                </HelperText>
              )}
            </>
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading || googleLoading}
          style={styles.button}
        >
          {t('auth.login.submit')}
        </Button>

        <Button
          mode="outlined"
          onPress={signInWithGoogle}
          loading={googleLoading}
          disabled={loading || googleLoading}
          style={styles.button}
          icon="google"
        >
          {t('auth.login.googleButton')}
        </Button>

        <View style={styles.registerContainer}>
          <Text>{t('auth.login.noAccount')} </Text>
          <Link href="/(auth)/register" asChild>
            <Text style={styles.link}>{t('auth.login.register')}</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  input: {
    marginBottom: spacing.xs,
  },
  button: {
    marginTop: spacing.md,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  link: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});
