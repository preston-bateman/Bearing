import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ProfileSelectionModal } from '../components/profile/ProfileSelectionModal';
import { SoundPickerModal } from '../components/profile/SoundPickerModal';
import { TipsWisdomModal } from '../components/profile/TipsWisdomModal';
import { AppCard } from '../components/ui/AppCard';
import { ListItem } from '../components/ui/ListItem';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { colors, layout, radii, spacing, typography } from '../design/tokens';
import {
  getProfileSelectionLabel,
  PROFILE_LOCALE_OPTIONS,
  PROFILE_TIMEZONE_OPTIONS,
} from '../features/profile/profileOptions';
import { getProfileSoundOption } from '../features/profile/profileSounds';
import { getDifferentRandomProfileTip } from '../features/profile/profileTips';
import { useSoundPreview } from '../features/profile/useSoundPreview';
import { useUserProfile } from '../features/profile/useUserProfile';
import { ProfileTip } from '../features/profile/profileTypes';

type ProfileScreenProps = {
  onPressSignOut: () => Promise<void> | void;
  isSignOutPending: boolean;
};

export function ProfileScreen({ onPressSignOut, isSignOutPending }: ProfileScreenProps) {
  const { profile, uiState, error, isAnonymous, email, updateProfile, sendPasswordReset, linkAnonymousAccount } =
    useUserProfile();
  const { previewSound, stopPreview, previewError, playingSoundId } = useSoundPreview();
  const [displayName, setDisplayName] = useState('');
  const [timezone, setTimezone] = useState('');
  const [locale, setLocale] = useState('');
  const [accountPending, setAccountPending] = useState(false);
  const [accountFeedback, setAccountFeedback] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [linkDisplayName, setLinkDisplayName] = useState('');
  const [linkEmail, setLinkEmail] = useState('');
  const [linkPassword, setLinkPassword] = useState('');
  const [linkPasswordConfirm, setLinkPasswordConfirm] = useState('');
  const [linkPending, setLinkPending] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [soundPicker, setSoundPicker] = useState<'alarm' | 'reminder' | null>(null);
  const [selectionPicker, setSelectionPicker] = useState<'timezone' | 'locale' | null>(null);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [activeTip, setActiveTip] = useState<ProfileTip | null>(null);
  const [soundPending, setSoundPending] = useState(false);
  const [soundError, setSoundError] = useState<string | null>(null);
  const [passwordResetPending, setPasswordResetPending] = useState(false);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setDisplayName(profile.displayName);
    setTimezone(profile.timezone);
    setLocale(profile.locale);
    setLinkDisplayName((current) => current || profile.displayName);
  }, [profile]);

  async function handleSaveAccountSettings(): Promise<void> {
    if (!profile) {
      return;
    }

    if (!timezone.trim()) {
      setAccountError('Timezone is required.');
      return;
    }

    if (!locale.trim()) {
      setAccountError('Locale is required.');
      return;
    }

    setAccountPending(true);
    setAccountFeedback(null);
    setAccountError(null);

    try {
      await updateProfile({
        displayName,
        timezone,
        locale,
      });
      setAccountFeedback('Account settings saved.');
    } catch (saveError) {
      setAccountError(saveError instanceof Error ? saveError.message : 'Failed to save account settings.');
    } finally {
      setAccountPending(false);
    }
  }

  function handleOpenTipModal(): void {
    setActiveTip((currentTip) => currentTip ?? getDifferentRandomProfileTip(null));
    setTipModalVisible(true);
  }

  function handleRefreshTip(): void {
    setActiveTip((currentTip) => getDifferentRandomProfileTip(currentTip?.id ?? null));
  }

  async function handleSendPasswordReset(): Promise<void> {
    setPasswordResetPending(true);
    setAccountError(null);

    try {
      await sendPasswordReset();
      Alert.alert('Password reset sent', `Check ${email ?? 'your inbox'} for the reset link.`);
    } catch (resetError) {
      setAccountError(resetError instanceof Error ? resetError.message : 'Failed to send password reset email.');
    } finally {
      setPasswordResetPending(false);
    }
  }

  async function handleLinkAnonymousAccount(): Promise<void> {
    if (!linkDisplayName.trim()) {
      setLinkError('Display name is required to secure the account.');
      return;
    }

    if (!linkEmail.trim()) {
      setLinkError('Email is required.');
      return;
    }

    if (linkPassword.length < 6) {
      setLinkError('Password must be at least 6 characters.');
      return;
    }

    if (linkPassword !== linkPasswordConfirm) {
      setLinkError('Passwords do not match.');
      return;
    }

    setLinkPending(true);
    setLinkError(null);

    try {
      await linkAnonymousAccount({
        email: linkEmail,
        password: linkPassword,
        displayName: linkDisplayName,
      });
      setLinkPassword('');
      setLinkPasswordConfirm('');
      setLinkEmail('');
      Alert.alert('Account secured', 'This session is now linked to your email and password.');
    } catch (secureError) {
      setLinkError(secureError instanceof Error ? secureError.message : 'Failed to secure the account.');
    } finally {
      setLinkPending(false);
    }
  }

  function closeSoundPicker(): void {
    stopPreview();
    setSoundPicker(null);
  }

  async function handleSelectSound(soundId: string): Promise<void> {
    if (!profile || !soundPicker) {
      return;
    }

    setSoundPending(true);
    setSoundError(null);

    try {
      await updateProfile(
        soundPicker === 'alarm' ? { alarmSoundId: soundId } : { reminderSoundId: soundId },
      );
      closeSoundPicker();
    } catch (selectionError) {
      setSoundError(selectionError instanceof Error ? selectionError.message : 'Failed to save sound setting.');
    } finally {
      setSoundPending(false);
    }
  }

  function handleSelectTimezone(nextValue: string): void {
    setTimezone(nextValue);
    setSelectionPicker(null);
  }

  function handleSelectLocale(nextValue: string): void {
    setLocale(nextValue);
    setSelectionPicker(null);
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ScreenHeader
          eyebrow="Profile"
          title="Profile"
          description="Manage your account, settings, sounds, and a few small prompts that keep the app useful every day."
        />

        {uiState === 'loading' ? (
          <AppCard>
            <Text style={styles.stateTitle}>Loading profile...</Text>
            <Text style={styles.stateDescription}>Fetching your account settings and sound preferences.</Text>
          </AppCard>
        ) : null}

        {uiState === 'error' ? (
          <AppCard>
            <Text style={styles.stateTitle}>Unable to load profile.</Text>
            <Text style={styles.stateDescription}>{error?.message ?? 'Try again in a moment.'}</Text>
          </AppCard>
        ) : null}

        {profile ? (
          <>
            <AppCard style={styles.cardSection}>
              <Text style={styles.sectionTitle}>Account settings</Text>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Display name</Text>
                <TextInput
                  accessibilityLabel="Profile display name"
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Your name"
                  style={styles.input}
                />
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Email</Text>
                <Text style={styles.metaValue}>{email || 'Anonymous session'}</Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Timezone</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open timezone picker"
                  onPress={() => setSelectionPicker('timezone')}
                  style={({ pressed }) => [styles.selectionButton, pressed ? styles.buttonPressed : null]}
                >
                  <Text style={styles.selectionLabel}>Timezone</Text>
                  <Text style={styles.selectionValue}>
                    {getProfileSelectionLabel(
                      PROFILE_TIMEZONE_OPTIONS,
                      timezone,
                      timezone || 'Select a timezone',
                    )}
                  </Text>
                  <Text style={styles.selectionMeta}>{timezone || 'Select a timezone'}</Text>
                </Pressable>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Locale</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Open locale picker"
                  onPress={() => setSelectionPicker('locale')}
                  style={({ pressed }) => [styles.selectionButton, pressed ? styles.buttonPressed : null]}
                >
                  <Text style={styles.selectionLabel}>Locale</Text>
                  <Text style={styles.selectionValue}>
                    {getProfileSelectionLabel(PROFILE_LOCALE_OPTIONS, locale, locale || 'Select a locale')}
                  </Text>
                  <Text style={styles.selectionMeta}>{locale || 'Select a locale'}</Text>
                </Pressable>
              </View>

              {accountError ? <Text style={styles.errorText}>{accountError}</Text> : null}
              {accountFeedback ? <Text style={styles.successText}>{accountFeedback}</Text> : null}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Save account settings"
                onPress={() => void handleSaveAccountSettings()}
                disabled={accountPending}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && !accountPending ? styles.buttonPressed : null,
                  accountPending ? styles.buttonDisabled : null,
                ]}
              >
                <Text style={styles.primaryButtonText}>{accountPending ? 'Saving...' : 'Save Account Settings'}</Text>
              </Pressable>
            </AppCard>

            {isAnonymous ? (
              <AppCard style={styles.cardSection}>
                <Text style={styles.sectionTitle}>Secure this anonymous session</Text>
                <Text style={styles.stateDescription}>Add email and password to keep the same app data while turning this session into a real account.</Text>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Display name</Text>
                  <TextInput
                    accessibilityLabel="Secure account display name"
                    value={linkDisplayName}
                    onChangeText={setLinkDisplayName}
                    placeholder="Your name"
                    style={styles.input}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    accessibilityLabel="Secure account email"
                    value={linkEmail}
                    onChangeText={setLinkEmail}
                    placeholder="you@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    accessibilityLabel="Secure account password"
                    value={linkPassword}
                    onChangeText={setLinkPassword}
                    secureTextEntry
                    placeholder="At least 6 characters"
                    style={styles.input}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Confirm password</Text>
                  <TextInput
                    accessibilityLabel="Secure account confirm password"
                    value={linkPasswordConfirm}
                    onChangeText={setLinkPasswordConfirm}
                    secureTextEntry
                    placeholder="Re-enter password"
                    style={styles.input}
                  />
                </View>

                {linkError ? <Text style={styles.errorText}>{linkError}</Text> : null}

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Secure anonymous account"
                  onPress={() => void handleLinkAnonymousAccount()}
                  disabled={linkPending}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && !linkPending ? styles.buttonPressed : null,
                    linkPending ? styles.buttonDisabled : null,
                  ]}
                >
                  <Text style={styles.primaryButtonText}>{linkPending ? 'Securing...' : 'Secure Account'}</Text>
                </Pressable>
              </AppCard>
            ) : (
              <View style={styles.actionBlock}>
                <ListItem
                  onPress={() => void handleSendPasswordReset()}
                  title="Reset password"
                  description="Send a Firebase reset email to the current account address."
                  trailingText={passwordResetPending ? 'Working...' : 'Send'}
                  disabled={passwordResetPending}
                />
              </View>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tips and wisdom"
              onPress={handleOpenTipModal}
              style={({ pressed }) => [styles.tipsButton, pressed ? styles.buttonPressed : null]}
            >
              <Text style={styles.tipsButtonText}>Tips & Wisdom</Text>
            </Pressable>

            <View style={styles.actionBlock}>
              <ListItem
                onPress={() => setSoundPicker('alarm')}
                title="Timer sound"
                description="Pick the sound used when timer-style alerts finish."
                trailingText={getProfileSoundOption(profile.alarmSoundId).label}
              />
              <ListItem
                onPress={() => setSoundPicker('reminder')}
                title="Reminder sound"
                description="Pick the sound used before scheduled events."
                trailingText={getProfileSoundOption(profile.reminderSoundId).label}
              />
              {soundError ? <Text style={styles.errorText}>{soundError}</Text> : null}
            </View>

            <View style={styles.actionBlock}>
              <ListItem
                title="Premium access"
                description="Purchases, restore, and entitlement management arrive in the monetization milestone."
                trailingText="Coming soon"
                disabled
              />
              <ListItem
                title="Google Calendar"
                description="Two-way Google Calendar connection arrives in the integrations milestone."
                trailingText="Coming soon"
                disabled
              />
              <ListItem
                title="Microsoft Calendar"
                description="Microsoft calendar sync is planned after core profile settings are stable."
                trailingText="Coming soon"
                disabled
              />
              <ListItem
                title="Apple Calendar"
                description="Apple calendar interoperability will be added with the wider calendar connection work."
                trailingText="Coming soon"
                disabled
              />
            </View>

            <View style={styles.actionBlock}>
              <ListItem
                onPress={onPressSignOut}
                title="Sign Out"
                description="End the current session on this device."
                trailingText={isSignOutPending ? 'Working...' : 'Action'}
                disabled={isSignOutPending}
              />
            </View>
          </>
        ) : null}
      </ScrollView>

      <SoundPickerModal
        visible={soundPicker !== null && profile !== null}
        title={soundPicker === 'alarm' ? 'Choose Timer Sound' : 'Choose Reminder Sound'}
        selectedSoundId={
          soundPicker === 'alarm' ? profile?.alarmSoundId ?? '' : profile?.reminderSoundId ?? ''
        }
        playingSoundId={playingSoundId}
        previewError={previewError}
        savePending={soundPending}
        onClose={closeSoundPicker}
        onPreview={previewSound}
        onSelect={handleSelectSound}
      />

      <ProfileSelectionModal
        visible={selectionPicker === 'timezone'}
        title="Timezone"
        searchPlaceholder="Search timezones by city or region"
        selectedValue={timezone}
        options={PROFILE_TIMEZONE_OPTIONS}
        onClose={() => setSelectionPicker(null)}
        onSelect={handleSelectTimezone}
      />

      <ProfileSelectionModal
        visible={selectionPicker === 'locale'}
        title="Locale"
        searchPlaceholder="Search locales by language or country"
        selectedValue={locale}
        options={PROFILE_LOCALE_OPTIONS}
        onClose={() => setSelectionPicker(null)}
        onSelect={handleSelectLocale}
      />

      <TipsWisdomModal
        visible={tipModalVisible}
        tip={activeTip}
        onClose={() => setTipModalVisible(false)}
        onRefresh={handleRefreshTip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: layout.pagePaddingHorizontal,
    paddingVertical: layout.pagePaddingVertical,
    gap: spacing.xl,
    paddingBottom: 120,
  },
  stateTitle: {
    ...typography.button,
    color: colors.text,
  },
  stateDescription: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  cardSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.button,
    color: colors.text,
  },
  fieldGroup: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  selectionButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  selectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  selectionValue: {
    ...typography.body,
    color: colors.text,
  },
  selectionMeta: {
    ...typography.helper,
    color: colors.textSecondary,
  },
  metaRow: {
    gap: spacing.xs,
  },
  metaLabel: {
    ...typography.label,
    color: colors.textSecondary,
  },
  metaValue: {
    ...typography.body,
    color: colors.text,
  },
  primaryButton: {
    borderRadius: radii.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.surface,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorText: {
    ...typography.helper,
    color: colors.dangerText,
  },
  successText: {
    ...typography.helper,
    color: colors.brand,
  },
  actionBlock: {
    gap: spacing.md,
  },
  tipsButton: {
    alignSelf: 'flex-start',
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.brand,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  tipsButtonText: {
    ...typography.button,
    color: colors.brand,
  },
});
