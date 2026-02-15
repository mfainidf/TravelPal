import { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../src/services/supabase';
import { spacing } from '../../src/theme/theme';
import { t } from '../../src/i18n';

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);

  // Validation schema - defined inside component to support dynamic translations
  const registerSchema = z.object({
    name: z.string().min(1, t('auth.register.errors.required')),
    email: z.string().min(1, t('auth.register.errors.required')).email(t('auth.register.errors.invalidEmail')),
    password: z.string().min(6, t('auth.register.errors.minPassword')),
    confirmPassword: z.string().min(1, t('auth.register.errors.required')),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.register.errors.passwordsNotMatch'),
    path: ['confirmPassword'],
  });

  type RegisterForm = z.infer<typeof registerSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      
      // Sign up the user
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (error) {
        // Handle specific error cases using status codes when available
        const errorMessage = error.message.toLowerCase();
        const statusCode = (error as any).status;
        
        // Check for user already exists (status 422 or 400)
        if (statusCode === 422 || statusCode === 400 || 
            errorMessage.includes('already registered') || 
            errorMessage.includes('already in use') ||
            errorMessage.includes('user already exists')) {
          Alert.alert('Errore', t('auth.register.errors.emailInUse'));
        } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          Alert.alert('Errore', t('auth.register.errors.networkError'));
        } else {
          Alert.alert('Errore', error.message);
        }
        return;
      }

      // Show success message
      Alert.alert(
        t('auth.register.success.title'),
        t('auth.register.success.message'),
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigation will be handled by the root layout once auth state changes
            },
          },
        ]
      );
    } catch {
      Alert.alert('Errore', t('auth.register.errors.unknownError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.form}>
        <Text variant="headlineLarge" style={styles.title}>
          {t('auth.register.title')}
        </Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label={t('auth.register.name')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                autoComplete="name"
                error={!!errors.name}
                style={styles.input}
                mode="outlined"
              />
              {errors.name && (
                <HelperText type="error" visible={!!errors.name}>
                  {errors.name.message}
                </HelperText>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label={t('auth.register.email')}
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
                label={t('auth.register.password')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoComplete="password-new"
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

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <TextInput
                label={t('auth.register.confirmPassword')}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoComplete="password-new"
                error={!!errors.confirmPassword}
                style={styles.input}
                mode="outlined"
              />
              {errors.confirmPassword && (
                <HelperText type="error" visible={!!errors.confirmPassword}>
                  {errors.confirmPassword.message}
                </HelperText>
              )}
            </>
          )}
        />

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          {t('auth.register.submit')}
        </Button>

        <View style={styles.loginContainer}>
          <Text>{t('auth.register.hasAccount')} </Text>
          <Link href="/(auth)/login" asChild>
            <Text style={styles.link}>{t('auth.register.login')}</Text>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  link: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});
