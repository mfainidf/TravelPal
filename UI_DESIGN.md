# UI/UX Design - Multi-Profile Selector

## Component Visualization

### ProfileSelector Component

```
┌─────────────────────────────────────────────────────────────┐
│  Profili                                                     │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────┐ │
│  │   [◉]      │  │   [GM]     │  │   [SA]     │  │  [+]  │ │
│  │    ●✓      │  │            │  │            │  │       │ │
│  │            │  │            │  │            │  │Aggiungi│
│  │ Mario Rossi│  │Giulia Mazzi│  │Sara Antoni│  │Profilo│ │
│  │mario@ex.com│  │giulia@...  │  │sara@...   │  │       │ │
│  │     [×]    │  │     [×]    │  │     [×]    │  │       │ │
│  └────────────┘  └────────────┘  └────────────┘  └───────┘ │
│     ACTIVE         INACTIVE       INACTIVE                  │
└─────────────────────────────────────────────────────────────┘
       ↑              ↑              ↑              ↑
   Blue border    Standard       Standard      Add button
   + Checkmark      card           card
```

### Home Screen Layout

```
┌─────────────────────────────────────────────────┐
│  TravelPal                                      │
│  Ciao, Mario Rossi!                             │
├─────────────────────────────────────────────────┤
│                                                 │
│  [ProfileSelector Component - Horizontal Scroll]│
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  I tuoi viaggi                                  │
│                                                 │
│  Inizia a pianificare il tuo prossimo viaggio! │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Profile Screen Layout

```
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────┐   │
│  │           [Avatar 80px]                 │   │
│  │                                         │   │
│  │          Mario Rossi                    │   │
│  │        mario@example.com                │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [ProfileSelector Component - Horizontal Scroll]│
│                                                 │
│  ┌────────────────────────┐                    │
│  │        Logout          │                    │
│  └────────────────────────┘                    │
└─────────────────────────────────────────────────┘
```

### Add Profile Modal

```
┌─────────────────────────────────────────────────┐
│  Aggiungi Profilo                          [×]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Accedi con un account esistente per            │
│  aggiungere un nuovo profilo                    │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Nome                                     │  │
│  │ [________________]                       │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Email                                    │  │
│  │ [________________]                       │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ Password                           [👁]  │  │
│  │ [••••••••••••••]                        │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌────────────────────────┐                    │
│  │  Aggiungi Profilo      │ (Blue button)      │
│  └────────────────────────┘                    │
│                                                 │
│           Annulla                               │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Color Scheme

- **Primary:** #2196F3 (Blue) - Active borders, buttons
- **Secondary:** #FF9800 (Orange) - Accents
- **Tertiary:** #4CAF50 (Green) - Success states
- **Background:** #F5F5F5 (Light gray)
- **Cards:** #FFFFFF (White) with elevation
- **Text:** Dark gray (default from Material Design 3)

## Visual States

### Profile Card States

1. **Active Profile**
   - Blue border (2px, #2196F3)
   - Blue checkmark badge in avatar corner
   - Slightly elevated (elevation: 4)

2. **Inactive Profile**
   - Standard card elevation (elevation: 2)
   - No border
   - No checkmark

3. **Loading State**
   - ActivityIndicator in center
   - Profiles grayed out or hidden

4. **Empty State**
   - Text: "Nessun profilo attivo"
   - Call-to-action button: "Aggiungi Profilo"

## Interactions

### Profile Card
- **Tap:** Switch to that profile
- **Tap X button:** Remove profile (with confirmation?)
- **Long press:** Future: Show profile options menu

### Add Profile Button
- **Tap:** Open add profile modal
- **Modal:** Form with email, password, name inputs
- **Submit:** Add profile and return to previous screen

## Accessibility

- **Touch Targets:** All buttons minimum 48dp
- **Labels:** All icon buttons have accessibilityLabel
  - "Profilo attivo" for checkmark
  - "Rimuovi profilo" for X button
- **Screen Readers:** Profile cards announce name, email, and active status
- **Color Contrast:** All text meets WCAG AA standards

## Responsive Behavior

- **Horizontal Scroll:** Profiles scroll left-right
- **Card Width:** Fixed 140px per card
- **Spacing:** 12px between cards
- **Padding:** 16px horizontal container padding

## Animation Ideas (Future)

- Smooth scroll to new active profile on switch
- Fade in/out on profile add/remove
- Scale animation on card tap
- Badge pop-in animation for active state

## Typography (Material Design 3)

- **Section Title:** titleMedium (bold)
- **Profile Name:** bodyMedium (bold)
- **Profile Email:** bodySmall (opacity 0.7)
- **Buttons:** Default button text
- **Headers:** headlineMedium/headlineSmall

## Loading & Error States

### Loading
```
┌─────────────────────────────────────┐
│  Profili                            │
│                                     │
│        ⟳ Loading...                │
│                                     │
└─────────────────────────────────────┘
```

### Error
```
┌─────────────────────────────────────┐
│  Profili                            │
│                                     │
│  ⚠ Errore nel caricamento profili  │
│                                     │
└─────────────────────────────────────┘
```

## Real-World Usage Example

**Scenario:** Family Shared Device

```
Home Screen:
┌──────────────────────────────────────────┐
│ TravelPal                                │
│ Ciao, Marco!                             │
├──────────────────────────────────────────┤
│ Profili                                  │
│ [Marco●] [Laura] [Sofia] [Luca] [+]     │
│  Active   Inactive                       │
├──────────────────────────────────────────┤
│ I tuoi viaggi                            │
│ • Weekend a Firenze (Marco)              │
│ • Vacanza Estiva (Marco)                 │
└──────────────────────────────────────────┘

User taps "Laura" profile:

┌──────────────────────────────────────────┐
│ TravelPal                                │
│ Ciao, Laura!                             │
├──────────────────────────────────────────┤
│ Profili                                  │
│ [Marco] [Laura●] [Sofia] [Luca] [+]     │
│ Inactive Active                          │
├──────────────────────────────────────────┤
│ I tuoi viaggi                            │
│ • Conferenza Milano (Laura)              │
│ • Viaggio Lavoro Roma (Laura)            │
└──────────────────────────────────────────┘
```

## Implementation Details

### Avatar Display Logic
```typescript
// If profile has avatar URL:
<Avatar.Image size={48} source={{ uri: profile.avatar }} />

// If no avatar, show initials:
<Avatar.Text size={48} label={getInitials(profile.name)} />
// e.g., "Mario Rossi" → "MR"
```

### Active Profile Indicator
```typescript
{isActive && (
  <View style={styles.activeIndicator}>
    <IconButton 
      icon="check-circle" 
      size={16} 
      iconColor="white"
      accessibilityLabel="Profilo attivo"
    />
  </View>
)}
```

### Horizontal Scroll
```typescript
<ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false}
  style={styles.scrollView}
>
  {profiles.map(profile => <ProfileCard ... />)}
</ScrollView>
```

## Testing Checklist

- [ ] Profile cards render correctly
- [ ] Active profile shows blue border and checkmark
- [ ] Scroll works smoothly with many profiles
- [ ] Add profile button opens modal
- [ ] Remove profile button works
- [ ] Profile switch updates UI
- [ ] Avatar images load correctly
- [ ] Initials generate correctly
- [ ] Touch targets are adequate size
- [ ] Accessibility labels work with screen readers
- [ ] Loading state displays correctly
- [ ] Error states show appropriate messages

## Platform-Specific Notes

### iOS
- Native feel with smooth scrolling
- Haptic feedback on profile switch (future)

### Android
- Material Design 3 ripple effects
- System back button closes modal

### Web
- Mouse hover states for cards
- Keyboard navigation support
