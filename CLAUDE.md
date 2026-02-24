# CLAUDE.md - Self-Mastery Development Guide

> This document defines the architecture, patterns, and principles for Self-Mastery. All code must follow these guidelines to ensure consistency across the team.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Core Principles](#2-core-principles)
3. [Monorepo Structure](#3-monorepo-structure)
4. [Backend Architecture](#4-backend-architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Request Flow](#6-request-flow)
7. [Security & Authentication](#7-security--authentication)
8. [LLM Integration](#8-llm-integration)
9. [Internationalization](#9-internationalization)
10. [Validation with Zod](#10-validation-with-zod)
11. [State Management](#11-state-management)
12. [Error Handling](#12-error-handling)
13. [Testing](#13-testing)
14. [Code Style](#14-code-style)
15. [Prompting Guidelines for Claude Code](#15-prompting-guidelines-for-claude-code)
16. [Common Tasks](#16-common-tasks)

---

## 1. Project Overview

Self-Mastery is an AI-powered personal wellness app. The application asks users about their current mood and generates supportive, motivational quotes using AI to help them navigate their emotional state.

**Key Characteristics:**

- Personal wellness application
- AI-powered quote generation via OpenAI API (GPT-4o mini)
- Mood tracking with history and insights
- Favorite quotes collection
- Privacy-focused design

**Core Flow:**

1. User logs in via Clerk
2. App presents mood selection ("How are you feeling?")
3. User selects their mood (and optionally adds a note)
4. AI generates a personalized supportive quote based on the mood
5. User can save favorite quotes and browse their mood history

---

## 2. Core Principles

### 2.1 AI by Design

Self-Mastery is an AI-native application. AI is not an afterthought—it's central to every feature.

**Co-pilot Integration:**

- Every major feature should consider: "How can AI assist the user here?"
- Use AI to generate personalized, context-aware supportive quotes
- AI adapts its tone and message based on the user's mood and history
- Consider AI-assisted insights from mood patterns over time

**AI-Assisted Development:**

- This codebase is designed to be developed with AI coding assistants
- Clear patterns and consistent structure help AI understand context
- Well-documented code enables effective AI pair programming
- When building features, consider how an AI assistant would navigate the code

**LLM-First Architecture:**

- LLM providers are modular and swappable
- All AI interactions are tracked for quality
- Prompt templates are versioned and testable
- AI responses are validated and sanitized

### 2.2 Security First

Every feature must consider security implications. All sensitive data is encrypted. No PII in logs.

### 2.3 Privacy by Design

User mood data is personal and sensitive. Data minimization is practiced throughout. Users control their own data.

### 2.4 Personal Wellness Focus

The app exists to support users emotionally. Every design decision should prioritize the user's wellbeing. Language is supportive, never judgmental. The experience should feel calm and encouraging.

### 2.5 Consistency Over Cleverness

Follow established patterns. Write code that others can understand. Prefer explicit over implicit.

### 2.6 Type Safety

Everything is typed. Use Zod for runtime validation. No `any` types without explicit justification.

### 2.7 Test Coverage

All business logic has tests. Critical paths have integration tests. Aim for 75%+ coverage.

---

## 3. Monorepo Structure

```
self-mastery/
├── backend/              # Express API server
├── frontend/             # Vue 3 SPA
├── shared/               # Shared types and utilities
├── infrastructure/       # AWS CDK (Infrastructure as Code)
├── docs/                 # Documentation
└── scripts/              # Development scripts
```

### Folder Responsibilities

| Folder           | Purpose                                         | Can Import From |
| ---------------- | ----------------------------------------------- | --------------- |
| `backend`        | REST API, business logic, database, LLM modules | `shared`        |
| `frontend`       | Vue 3 web application                           | `shared`        |
| `shared`         | Types, constants, Zod schemas, utilities        | Nothing         |
| `infrastructure` | AWS CDK stacks                                  | Nothing         |

### Import Rules

- `shared` can be imported by `backend` and `frontend`
- `backend` and `frontend` never import each other
- Circular dependencies are forbidden

### Infrastructure Strategy

| Environment | Database             | Reason                                        |
| ----------- | -------------------- | --------------------------------------------- |
| Local       | Docker PostgreSQL    | Free, easy setup                              |
| Staging     | RDS PostgreSQL       | Cost-effective (~$12/month)                   |
| Production  | Aurora Serverless v2 | Auto-scaling, built-in HA, multi-region ready |

---

## 4. Backend Architecture

### 4.1 Directory Structure

```
backend/src/
├── routes/               # HTTP route definitions
│   ├── auth.ts
│   ├── mood.ts
│   └── quote.ts
├── controllers/          # Business logic orchestration
│   ├── auth.ts
│   ├── mood.ts
│   └── quote.ts
├── services/             # Cross-cutting concerns
│   └── quoteGenerator.ts # OpenAI quote generation (GPT-4o mini)
├── entities/             # Domain models (classes)
│   ├── User.ts
│   ├── MoodEntry.ts
│   └── Quote.ts
├── repositories/         # Database operations
│   ├── user.ts
│   ├── mood.ts
│   └── quote.ts
├── middleware/           # Express middleware
│   ├── auth.ts
│   └── validate.ts
├── types/                # TypeScript types
├── utils/                # Helper functions
├── jobs/                 # Background jobs
└── config/               # Configuration
```

### 4.2 File Naming

Files are named after what they contain, without redundant suffixes since the folder already indicates the type:

```
✅ CORRECT
routes/
├── auth.ts
├── mood.ts
└── quote.ts

controllers/
├── auth.ts
├── mood.ts
└── quote.ts

repositories/
├── user.ts
├── mood.ts
└── quote.ts

❌ WRONG
routes/
├── auth.routes.ts        # Redundant - already in routes/
├── mood.routes.ts
```

### 4.3 Layer Responsibilities

#### Routes (`/routes/`)

- Define HTTP endpoints
- Parse request parameters
- Call controllers
- Return responses
- **NO business logic here**

```typescript
// routes/mood.ts

// ✅ CORRECT - Route only handles HTTP concerns
router.post(
  '/',
  authMiddleware,
  validateRequest(CreateMoodEntrySchema),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await moodController.create(req);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

// ❌ WRONG - Business logic in route
router.post('/', async (req, res) => {
  const mood = await prisma.moodEntry.create({ data: req.body }); // NO!
  res.json(mood);
});
```

#### Controllers (`/controllers/`)

- Contain all business logic orchestration
- Call services for cross-cutting concerns
- Transform request data into entities
- Call repositories via entities
- Transform entities for responses
- **NO direct database calls**

```typescript
// controllers/mood.ts

// ✅ CORRECT - Controller orchestrates the flow
export class MoodController {
  constructor(
    private readonly moodRepo: MoodRepository,
    private readonly quoteGenerator: QuoteGeneratorService,
    private readonly quoteRepo: QuoteRepository,
    private readonly cache: CacheService
  ) {}

  async create(req: AuthenticatedRequest): Promise<ApiResponse<MoodEntryWithQuoteJson>> {
    const { userId } = req.user;

    // 1. Create mood entry entity from request data
    const moodData = MoodEntry.fromCreateDto(req.body, userId);

    // 2. Persist mood entry via repository
    const moodEntry = await this.moodRepo.create(moodData);

    // 3. Generate a quote via LLM service
    const quoteContent = await this.quoteGenerator.generate(moodEntry.mood, moodEntry.note);

    // 4. Persist the quote
    const quote = await this.quoteRepo.create(
      Quote.fromGenerated(quoteContent, userId, moodEntry.id)
    );

    // 5. Return JSON response
    return {
      success: true,
      data: {
        moodEntry: moodEntry.toJson(),
        quote: quote.toJson(),
      },
    };
  }
}
```

#### Services (`/services/`)

- Handle cross-cutting concerns
- Examples: LLM calls, caching, quote generation
- Injected into controllers
- **NO HTTP handling**
- **NO direct entity creation**

#### Entities (`/entities/`)

- Represent domain objects as classes
- Contain transformation logic (toJson, fromJson, fromPrisma, fromCreateDto)
- Contain domain logic and validation
- **NO database operations**
- **NO external service calls**

```typescript
// entities/MoodEntry.ts
export class MoodEntry {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly mood: MoodType,
    public readonly note: string | null,
    public readonly createdAt: Date
  ) {}

  static fromPrisma(data: PrismaMoodEntry): MoodEntry {
    return new MoodEntry(data.id, data.userId, data.mood as MoodType, data.note, data.createdAt);
  }

  static fromCreateDto(dto: CreateMoodEntryDto, userId: string): MoodEntryCreateData {
    return {
      userId,
      mood: dto.mood,
      note: dto.note ?? null,
    };
  }

  toJson(): MoodEntryJson {
    return {
      id: this.id,
      mood: this.mood,
      note: this.note,
      createdAt: this.createdAt.toISOString(),
    };
  }
}
```

#### Repositories (`/repositories/`)

- Handle all database operations
- Always scope queries by `userId`
- Accept entity data, return entities
- **NO business logic**
- **NO service calls**

### 4.4 User Data Isolation

**Every database query MUST include userId.**

```typescript
// ✅ CORRECT - Always filter by user
async findById(id: string, userId: string): Promise<MoodEntry | null> {
  return this.prisma.moodEntry.findFirst({
    where: { id, userId }
  });
}

// ❌ WRONG - Missing user filter
async findById(id: string): Promise<MoodEntry | null> {
  return this.prisma.moodEntry.findFirst({
    where: { id }  // Security vulnerability!
  });
}
```

### 4.5 Domain Types

```typescript
// shared/src/types/mood.ts
export const MOOD_TYPES = [
  'low',
  'anxious',
  'neutral',
  'hopeful',
  'energized',
] as const;

export type MoodType = (typeof MOOD_TYPES)[number];
```

---

## 5. Frontend Architecture (Vue 3)

Self-Mastery uses Vue 3 with Vite for the web application.

### 5.1 Technology Stack

| Technology                 | Purpose                              |
| -------------------------- | ------------------------------------ |
| Vue 3                      | Frontend framework (Composition API) |
| Vite                       | Build tool & dev server              |
| Vue Router                 | Client-side routing                  |
| Pinia                      | State management                     |
| TanStack Query (Vue Query) | Server state & caching               |
| TypeScript                 | Type safety                          |
| Tailwind CSS               | Utility-first styling                |
| vue-i18n                   | Internationalization                 |
| Clerk                      | Authentication                       |

### 5.2 Directory Structure

```
frontend/
├── src/
│   ├── views/                # Page components (routes)
│   │   ├── auth/
│   │   │   └── LoginView.vue
│   │   ├── mood/
│   │   │   └── MoodSelectView.vue
│   │   ├── quote/
│   │   │   └── QuoteView.vue
│   │   ├── history/
│   │   │   └── HistoryView.vue
│   │   ├── favorites/
│   │   │   └── FavoritesView.vue
│   │   └── settings/
│   │       └── SettingsView.vue
│   │
│   ├── components/
│   │   ├── atoms/            # Basic building blocks
│   │   │   ├── AppButton.vue
│   │   │   ├── AppInput.vue
│   │   │   ├── AppCard.vue
│   │   │   ├── AppBadge.vue
│   │   │   ├── AppSpinner.vue
│   │   │   ├── AppMoodIcon.vue
│   │   │   └── index.ts
│   │   ├── molecules/        # Combinations of atoms
│   │   │   ├── FormField.vue
│   │   │   ├── MoodCard.vue
│   │   │   ├── QuoteCard.vue
│   │   │   └── index.ts
│   │   ├── organisms/        # Complex components
│   │   │   ├── MoodSelector.vue
│   │   │   ├── QuoteDisplay.vue
│   │   │   └── index.ts
│   │   └── templates/        # Page layouts
│   │       ├── AuthLayout.vue
│   │       ├── MainLayout.vue
│   │       └── index.ts
│   │
│   ├── stores/               # Pinia stores
│   │   ├── auth.ts
│   │   └── ui.ts
│   │
│   ├── services/             # API clients
│   │   ├── api.ts
│   │   └── queries/          # Vue Query composables
│   │       ├── useMoods.ts
│   │       ├── useQuotes.ts
│   │       └── useAuth.ts
│   │
│   ├── composables/          # Reusable composition functions
│   │   ├── useAuth.ts
│   │   └── useToast.ts
│   │
│   ├── router/               # Vue Router configuration
│   │   ├── index.ts
│   │   └── guards.ts
│   │
│   ├── i18n/                 # Translations
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── nl.json
│   │
│   ├── styles/               # Global styles
│   │   ├── main.css
│   │   └── variables.css
│   │
│   ├── types/                # TypeScript types
│   ├── utils/                # Helper functions
│   ├── App.vue               # Root component
│   └── main.ts               # Entry point
│
├── public/                   # Static assets
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 5.3 Vue Component Conventions

#### Single File Components (SFC)

Use `<script setup>` with TypeScript:

```vue
<!-- components/atoms/AppButton.vue -->
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--full-width': fullWidth, 'btn--loading': loading },
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <AppSpinner v-if="loading" size="sm" class="mr-2" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center font-semibold rounded-lg transition-all;
}

.btn--primary {
  @apply bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed;
}

.btn--secondary {
  @apply bg-card text-white border border-border hover:bg-card-hover;
}

.btn--ghost {
  @apply bg-transparent text-primary hover:bg-primary/10;
}

.btn--danger {
  @apply bg-error text-white hover:bg-error/90;
}

.btn--sm {
  @apply h-9 px-3 text-sm;
}

.btn--md {
  @apply h-11 px-4 text-base;
}

.btn--lg {
  @apply h-13 px-5 text-lg;
}

.btn--full-width {
  @apply w-full;
}

.btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>
```

### 5.4 Tailwind CSS Theme

Configure Tailwind with Self-Mastery brand colors:

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: {
          DEFAULT: '#4A90D9',
          hover: '#5A9FE8',
          pressed: '#3A80C9',
          muted: 'rgba(74, 144, 217, 0.15)',
        },
        // Backgrounds
        background: '#0A0E17',
        card: {
          DEFAULT: '#151B28',
          hover: '#1A2233',
        },
        input: '#1E2536',
        // Text
        'text-primary': '#FFFFFF',
        'text-secondary': '#8B95A5',
        'text-muted': '#5A6475',
        // Borders
        border: '#2A3344',
        // Status
        success: {
          DEFAULT: '#34D399',
          muted: 'rgba(52, 211, 153, 0.15)',
        },
        warning: {
          DEFAULT: '#FBBF24',
          muted: 'rgba(251, 191, 36, 0.15)',
        },
        error: {
          DEFAULT: '#F87171',
          muted: 'rgba(248, 113, 113, 0.15)',
        },
      },
      height: {
        13: '3.25rem',
      },
    },
  },
  plugins: [],
};
```

### 5.5 Atomic Design Pattern

Self-Mastery follows the **Atomic Design** methodology for organizing UI components.

#### The Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│ VIEWS (src/views/)                                              │
│ • Full pages connected to routes                                │
│ • Handle routing, data fetching, orchestrate UI                 │
└─────────────────────────────────────────────────────────────────┘
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ TEMPLATES (src/components/templates/)                           │
│ • Page layouts with slots for content                           │
│ • Define structure, not content                                 │
│ • Examples: AuthLayout, MainLayout                              │
└─────────────────────────────────────────────────────────────────┘
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ ORGANISMS (src/components/organisms/)                           │
│ • Complex, self-contained UI sections                           │
│ • CAN use stores and composables                                │
│ • Examples: MoodSelector, QuoteDisplay                          │
└─────────────────────────────────────────────────────────────────┘
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ MOLECULES (src/components/molecules/)                           │
│ • Combinations of atoms with specific purpose                   │
│ • CANNOT use stores or APIs                                     │
│ • Examples: FormField, MoodCard, QuoteCard                      │
└─────────────────────────────────────────────────────────────────┘
                              │ uses
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ ATOMS (src/components/atoms/)                                   │
│ • Smallest building blocks                                      │
│ • CANNOT use stores, APIs, or complex composables               │
│ • Examples: AppButton, AppInput, AppCard, AppMoodIcon           │
└─────────────────────────────────────────────────────────────────┘
```

### 5.6 Component Rules

**IMPORTANT**: These rules are strictly enforced. Breaking them creates technical debt.

| Level         | Store Access | API Calls                | Composables Allowed   | Can Import                  |
| ------------- | ------------ | ------------------------ | --------------------- | --------------------------- |
| **Atoms**     | ❌ Never     | ❌ Never                 | ❌ None (pure styled) | Nothing                     |
| **Molecules** | ❌ Never     | ❌ Never                 | ✅ useI18n only       | Atoms                       |
| **Organisms** | ✅ Yes       | ✅ Yes (via composables) | ✅ All composables    | Atoms, Molecules            |
| **Templates** | ❌ Never     | ❌ Never                 | ❌ Layout only        | Atoms, Molecules, Organisms |
| **Views**     | ✅ Yes       | ✅ Yes                   | ✅ All composables    | Everything                  |

### 5.7 Component Naming

All components use `App` prefix for atoms to avoid conflicts with HTML elements:

```
✅ CORRECT
AppButton.vue
AppInput.vue
AppCard.vue
AppSpinner.vue
AppMoodIcon.vue

❌ WRONG
Button.vue      # Conflicts with <button>
Input.vue       # Conflicts with <input>
```

### 5.8 Vue Router Configuration

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false, layout: 'auth' },
    },
    {
      path: '/',
      name: 'mood-select',
      component: () => import('@/views/mood/MoodSelectView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/quote/:id',
      name: 'quote',
      component: () => import('@/views/quote/QuoteView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/history/HistoryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/favorites/FavoritesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/settings/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Wait for auth to be initialized
  if (!authStore.isInitialized) {
    await authStore.initialize();
  }

  const { isAuthenticated } = authStore;

  // Check auth requirement
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login' });
  }

  // Redirect authenticated users away from login
  if (to.name === 'login' && isAuthenticated) {
    return next({ name: 'mood-select' });
  }

  next();
});

export default router;
```

### 5.9 Example Components

#### Atom Example: Mood Icon

```vue
<!-- components/atoms/AppMoodIcon.vue -->
<script setup lang="ts">
import type { MoodType } from '@self-mastery/shared';

interface Props {
  mood: MoodType;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  selected: false,
});

const moodEmojis: Record<MoodType, string> = {
  happy: '😊',
  calm: '😌',
  grateful: '🙏',
  anxious: '😰',
  sad: '😢',
  angry: '😤',
  tired: '😴',
  motivated: '💪',
  confused: '🤔',
  hopeful: '🌟',
};
</script>

<template>
  <span
    :class="[
      'mood-icon',
      `mood-icon--${size}`,
      { 'mood-icon--selected': selected },
    ]"
    role="img"
    :aria-label="mood"
  >
    {{ moodEmojis[mood] }}
  </span>
</template>

<style scoped>
.mood-icon {
  @apply inline-flex items-center justify-center rounded-full transition-all;
}

.mood-icon--sm {
  @apply text-xl w-8 h-8;
}

.mood-icon--md {
  @apply text-3xl w-12 h-12;
}

.mood-icon--lg {
  @apply text-5xl w-16 h-16;
}

.mood-icon--selected {
  @apply ring-2 ring-primary bg-primary-muted;
}
</style>
```

#### Molecule Example: Mood Card

```vue
<!-- components/molecules/MoodCard.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AppCard, AppMoodIcon } from '@/components/atoms';
import type { MoodType } from '@self-mastery/shared';

interface Props {
  mood: MoodType;
  selected?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  select: [];
}>();

const { t } = useI18n();
</script>

<template>
  <AppCard
    :class="['mood-card', { 'mood-card--selected': selected }]"
    role="button"
    tabindex="0"
    @click="emit('select')"
    @keydown.enter="emit('select')"
  >
    <AppMoodIcon :mood="mood" size="lg" :selected="selected" />
    <span class="mood-card__label">{{ t(`moods.${mood}`) }}</span>
  </AppCard>
</template>

<style scoped>
.mood-card {
  @apply flex flex-col items-center gap-2 p-4 cursor-pointer
         hover:bg-card-hover transition-all;
}

.mood-card--selected {
  @apply border-primary bg-primary-muted;
}

.mood-card__label {
  @apply text-sm font-medium text-text-secondary;
}
</style>
```

#### Organism Example: Mood Selector

```vue
<!-- components/organisms/MoodSelector.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { MoodCard } from '@/components/molecules';
import { AppButton, AppInput } from '@/components/atoms';
import { MOOD_TYPES, type MoodType } from '@self-mastery/shared';

const emit = defineEmits<{
  submit: [mood: MoodType, note: string | null];
}>();

const { t } = useI18n();
const selectedMood = ref<MoodType | null>(null);
const note = ref('');

const handleSubmit = () => {
  if (selectedMood.value) {
    emit('submit', selectedMood.value, note.value || null);
  }
};
</script>

<template>
  <div class="mood-selector">
    <h2 class="mood-selector__title">{{ t('mood.howAreYouFeeling') }}</h2>

    <div class="mood-selector__grid">
      <MoodCard
        v-for="mood in MOOD_TYPES"
        :key="mood"
        :mood="mood"
        :selected="selectedMood === mood"
        @select="selectedMood = mood"
      />
    </div>

    <div v-if="selectedMood" class="mood-selector__note">
      <AppInput
        v-model="note"
        :placeholder="t('mood.addNote')"
      />
    </div>

    <AppButton
      :disabled="!selectedMood"
      full-width
      @click="handleSubmit"
    >
      {{ t('mood.getQuote') }}
    </AppButton>
  </div>
</template>

<style scoped>
.mood-selector {
  @apply flex flex-col gap-6;
}

.mood-selector__title {
  @apply text-2xl font-bold text-text-primary text-center;
}

.mood-selector__grid {
  @apply grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3;
}

.mood-selector__note {
  @apply mt-2;
}
</style>
```

#### Organism Example: Quote Display

```vue
<!-- components/organisms/QuoteDisplay.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AppCard, AppButton } from '@/components/atoms';
import type { Quote } from '@/types';

interface Props {
  quote: Quote;
}

defineProps<Props>();

const emit = defineEmits<{
  favorite: [];
  newMood: [];
}>();

const { t } = useI18n();
</script>

<template>
  <AppCard class="quote-display">
    <blockquote class="quote-display__text">
      "{{ quote.content }}"
    </blockquote>

    <div class="quote-display__actions">
      <AppButton
        :variant="quote.isFavorite ? 'primary' : 'secondary'"
        size="sm"
        @click="emit('favorite')"
      >
        {{ quote.isFavorite ? t('quote.saved') : t('quote.save') }}
      </AppButton>
      <AppButton variant="ghost" size="sm" @click="emit('newMood')">
        {{ t('quote.newMood') }}
      </AppButton>
    </div>
  </AppCard>
</template>

<style scoped>
.quote-display {
  @apply p-8 flex flex-col items-center gap-6 text-center;
}

.quote-display__text {
  @apply text-xl md:text-2xl font-medium text-text-primary leading-relaxed italic;
}

.quote-display__actions {
  @apply flex gap-3;
}
</style>
```

---

## 6. Request Flow

### 6.1 Complete Request Lifecycle

```
HTTP Request
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ ROUTE                                                           │
│ • Parse URL, method, params                                     │
│ • Apply middleware (auth, validation)                            │
│ • Call controller                                               │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ CONTROLLER                                                      │
│ • Orchestrate business logic                                    │
│ • Call services for cross-cutting concerns (LLM, cache, etc.)   │
│ • Transform request → Entity data                               │
│ • Call repository                                               │
└─────────────────────────────────────────────────────────────────┘
     │
     ├──────────────────┐
     ▼                  ▼
┌──────────────┐  ┌──────────────┐
│ SERVICE      │  │ ENTITY       │
│ • LLM calls  │  │ • fromDto()  │
│ • Caching    │  │ • Validation │
│ • Quote gen  │  │ • Domain     │
│              │  │   logic      │
└──────────────┘  └──────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│ REPOSITORY                                                      │
│ • Database operations                                           │
│ • Always includes userId                                        │
│ • Returns Entity (via fromPrisma)                               │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ ENTITY                                                          │
│ • fromPrisma() creates entity instance                          │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ CONTROLLER                                                      │
│ • Receives entity from repository                               │
│ • Calls entity.toJson() for response                            │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│ ROUTE                                                           │
│ • Returns JSON response                                         │
└─────────────────────────────────────────────────────────────────┘
     │
     ▼
JSON Response
```

### 6.2 Quote Generation Flow

```
User selects mood
     │
     ▼
POST /api/moods  { mood: "anxious", note: "big presentation tomorrow" }
     │
     ▼
MoodController.create()
     │
     ├─→ MoodRepository.create()     → saves mood entry to DB
     │
     ├─→ QuoteGeneratorService.generate(mood, note)
     │       │
     │       ├─→ Build prompt from mood context
     │       ├─→ Call OpenAI API (GPT-4o mini)
     │       └─→ Return { text, author } quote
     │
     ├─→ QuoteRepository.create()    → saves quote to DB
     │
     └─→ Return { moodEntry, quote } as JSON
```

---

## 7. Security & Authentication

### 7.1 Authentication Flow

```
1. User logs in via Clerk
2. Clerk returns session token
3. Frontend includes token in Authorization header
4. authMiddleware verifies token with Clerk
5. User loaded from database (created on first login)
6. Request continues with user context
```

### 7.2 Auth Middleware

```typescript
// middleware/auth.ts
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clerkAuth = getAuth(req);

    if (!clerkAuth.userId) {
      throw new UnauthorizedError('Authentication required');
    }

    // Load or create user
    let user = await userRepository.findByClerkId(clerkAuth.userId);

    if (!user) {
      // First login - create user record
      user = await userRepository.create({
        clerkId: clerkAuth.userId,
        email: clerkAuth.sessionClaims?.email as string,
        name: clerkAuth.sessionClaims?.name as string | null,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
```

### 7.3 Data Privacy Rules

- User mood data is personal and sensitive
- Users can only access their own data (`userId` scoping)
- No PII in logs
- Mood notes are never sent to analytics
- LLM prompts do not include user-identifying information

---

## 8. LLM Integration

### 8.1 Provider Architecture

```
services/
├── quoteGenerator.ts     # OpenAI quote generation service
```

### 8.2 OpenAI Provider

Self-Mastery uses OpenAI's GPT-4o mini model for quote generation. The integration is direct (no abstraction layer needed for a single provider).

```typescript
// services/quoteGenerator.ts
import OpenAI from 'openai';
import type { MoodType } from '@self-mastery/shared';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateQuote(mood: MoodType): Promise<{ text: string; author: string }> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a warm, compassionate wellness companion...' },
      { role: 'user', content: `I'm feeling ${mood}. Give me a quote that might help.` },
    ],
    temperature: 0.9,
    max_tokens: 150,
  });

  return JSON.parse(completion.choices[0].message.content);
}
```

### 8.3 Quote Generation Rules

- All LLM calls go through the `generateQuote` service
- No user-identifying information in prompts
- All responses are validated (JSON parsed and checked) before returning to the user
- Temperature set to 0.9 for variety in quotes
- Responses return `{ text, author }` format

---

## 9. Internationalization

### 9.1 Vue i18n Setup

```typescript
// i18n/index.ts
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import nl from './locales/nl.json';

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, nl },
});
```

### 9.2 Translation Structure

```json
// i18n/locales/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "back": "Back",
    "loading": "Loading..."
  },
  "moods": {
    "happy": "Happy",
    "calm": "Calm",
    "grateful": "Grateful",
    "anxious": "Anxious",
    "sad": "Sad",
    "angry": "Angry",
    "tired": "Tired",
    "motivated": "Motivated",
    "confused": "Confused",
    "hopeful": "Hopeful"
  },
  "mood": {
    "howAreYouFeeling": "How are you feeling?",
    "addNote": "Add a note (optional)...",
    "getQuote": "Get my quote"
  },
  "quote": {
    "save": "Save to favorites",
    "saved": "Saved",
    "newMood": "New mood check"
  },
  "nav": {
    "home": "Home",
    "history": "History",
    "favorites": "Favorites",
    "settings": "Settings"
  }
}
```

### 9.3 Using Translations

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div>
    <h1>{{ t('mood.howAreYouFeeling') }}</h1>
    <AppButton>{{ t('mood.getQuote') }}</AppButton>
  </div>
</template>
```

### 9.4 i18n Rules

```vue
<!-- ✅ CORRECT - Use translation key -->
<template>
  <span>{{ t('mood.howAreYouFeeling') }}</span>
</template>

<!-- ❌ WRONG - Hardcoded text -->
<template>
  <span>How are you feeling?</span>
</template>

<!-- ✅ CORRECT - Interpolation -->
<template>
  <span>{{ t('greeting', { name: user.name }) }}</span>
</template>
```

---

## 10. Validation with Zod

### 10.1 Schema Location

Schemas are defined in the `shared` package and used by both backend and frontend:

```
shared/src/schemas/
├── auth.ts
├── mood.ts
├── quote.ts
└── index.ts
```

### 10.2 Mood Schemas

```typescript
// shared/src/schemas/mood.ts
import { z } from 'zod';
import { MOOD_TYPES } from '../types/mood';

export const CreateMoodEntrySchema = z.object({
  mood: z.enum(MOOD_TYPES),
  note: z.string().max(500).optional(),
});

export type CreateMoodEntryDto = z.infer<typeof CreateMoodEntrySchema>;
```

### 10.3 Using Schemas in Vue

```typescript
// In a composable or store
import { CreateMoodEntrySchema } from '@self-mastery/shared';

const validateForm = (data: unknown) => {
  const result = CreateMoodEntrySchema.safeParse(data);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }
  return { data: result.data };
};
```

---

## 11. State Management (Pinia + Vue Query)

Self-Mastery uses **Pinia** for client state and **Vue Query** for server state.

### 11.1 When to Use Which

| State Type       | Tool      | Examples                          |
| ---------------- | --------- | --------------------------------- |
| **Server state** | Vue Query | Mood entries, quotes, favorites   |
| **Client state** | Pinia     | UI state, selected mood, theme    |
| **Auth state**   | Pinia     | Current user, tokens              |

### 11.2 Store Structure

```
stores/
├── auth.ts               # User authentication state
└── ui.ts                 # UI state (toasts, theme)
```

### 11.3 Pinia Store Pattern

```typescript
// stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/services/api';

interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isInitialized = ref(false);
  const isLoading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!user.value);

  // Actions
  const initialize = async () => {
    if (isInitialized.value) return;

    try {
      isLoading.value = true;
      await fetchAuthStatus();
    } finally {
      isLoading.value = false;
      isInitialized.value = true;
    }
  };

  const fetchAuthStatus = async () => {
    try {
      const response = await api.get('/api/auth/status');
      user.value = response.user;
    } catch (error) {
      user.value = null;
    }
  };

  const setToken = (newToken: string | null) => {
    token.value = newToken;
    api.setAuthToken(newToken);
  };

  const reset = () => {
    user.value = null;
    token.value = null;
    api.setAuthToken(null);
  };

  return {
    user,
    token,
    isInitialized,
    isLoading,
    isAuthenticated,
    initialize,
    fetchAuthStatus,
    setToken,
    reset,
  };
});
```

### 11.4 Vue Query for Server State

```typescript
// services/queries/useMoods.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { api } from '@/services/api';
import type { MoodEntry, CreateMoodEntryDto, MoodEntryWithQuote } from '@/types';

export function useMoodHistory() {
  return useQuery({
    queryKey: ['moods'],
    queryFn: () => api.get<MoodEntry[]>('/moods'),
  });
}

export function useCreateMoodEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMoodEntryDto) =>
      api.post<MoodEntryWithQuote>('/moods', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moods'] });
    },
  });
}
```

```typescript
// services/queries/useQuotes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { api } from '@/services/api';
import type { Quote } from '@/types';

export function useFavoriteQuotes() {
  return useQuery({
    queryKey: ['quotes', 'favorites'],
    queryFn: () => api.get<Quote[]>('/quotes/favorites'),
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quoteId: string) =>
      api.patch<Quote>(`/quotes/${quoteId}/favorite`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
  });
}
```

### 11.5 State Management Rules

```typescript
// ✅ CORRECT - Vue Query for server data
const { data: moods } = useMoodHistory();

// ✅ CORRECT - Pinia for UI state
const uiStore = useUIStore();
const theme = computed(() => uiStore.theme);

// ❌ WRONG - Storing server data in Pinia
// Don't do this! Use Vue Query instead
```

---

## 12. Error Handling

### 12.1 Frontend Error Handling

```typescript
// services/api.ts
class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number
  ) {
    super(message);
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const data = await response.json();
    throw new ApiError(
      data.error?.message || 'An error occurred',
      data.error?.code || 'UNKNOWN_ERROR',
      response.status
    );
  }
  return response.json();
};
```

### 12.2 Backend Error Classes

```typescript
// utils/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}
```

---

## 13. Testing

Self-Mastery uses **Vitest** for all testing (backend and frontend). All tests are located in structured directories with clear naming patterns. Coverage thresholds are enforced at 75%+ for all metrics.

### 13.1 Backend Testing with Vitest

#### 13.1.1 Test Structure

```
backend/tests/
├── setup.ts              # Global test setup
└── unit/                 # Unit tests
    ├── config/           # Configuration tests
    ├── controllers/      # Controller tests
    ├── entities/         # Entity tests
    ├── middleware/        # Middleware tests
    ├── services/         # Service tests
    ├── types/            # Type/error tests
    └── utils/            # Utility tests
```

#### 13.1.2 Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage
```

#### 13.1.3 Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: '.',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/index.ts',
        'src/app.ts',
        'src/services/database.ts',
        'src/repositories/**',
        'src/routes/**',
      ],
      thresholds: {
        branches: 75,
        functions: 75,
        lines: 75,
        statements: 75,
      },
    },
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
```

#### 13.1.4 Test Setup

```typescript
// tests/setup.ts
import { vi } from 'vitest';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.CLERK_SECRET_KEY = 'test_clerk_secret';
process.env.CLERK_PUBLISHABLE_KEY = 'test_clerk_publishable';
process.env.OPENAI_API_KEY = 'test_openai_key';

// Suppress console output in tests
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'info').mockImplementation(() => {});
vi.spyOn(console, 'debug').mockImplementation(() => {});
```

#### 13.1.5 Mocking Patterns

**Use `vi.hoisted()` to avoid hoisting issues:**

```typescript
import { vi } from 'vitest';

// ✅ CORRECT - Use vi.hoisted() for variables used in mocks
const { mockFindById, mockCreate } = vi.hoisted(() => ({
  mockFindById: vi.fn(),
  mockCreate: vi.fn(),
}));

vi.mock('../repositories', () => ({
  userRepository: {
    findById: mockFindById,
    create: mockCreate,
  },
}));
```

**Mock classes properly:**

```typescript
// ✅ CORRECT - Mock class with proper constructor
vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: vi.fn(),
      },
    }
  },
}));

// ❌ WRONG - This creates a function, not a class
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({ ... })),
}));
```

**Access mocked functions:**

```typescript
import * as quoteGenerator from '../services/quoteGenerator';

vi.mock('../services/quoteGenerator', () => ({
  generate: vi.fn(),
}));

const mockGenerate = vi.mocked(quoteGenerator.generate);
expect(mockGenerate).toHaveBeenCalledWith('anxious', 'big presentation');
```

#### 13.1.6 Dependency Injection in Tests

Self-Mastery uses dependency injection for testability. Controllers receive repositories and services as constructor parameters.

```typescript
// Example: Testing MoodController with DI
import { MoodController } from '../controllers/mood';

describe('MoodController', () => {
  it('creates a mood entry and generates a quote', async () => {
    const mockMoodRepo = {
      create: vi.fn().mockResolvedValue(fakeMoodEntry),
    };
    const mockQuoteRepo = {
      create: vi.fn().mockResolvedValue(fakeQuote),
    };
    const mockQuoteGenerator = {
      generate: vi.fn().mockResolvedValue('You are stronger than you think.'),
    };

    const controller = new MoodController(
      mockMoodRepo,
      mockQuoteGenerator,
      mockQuoteRepo
    );
    const result = await controller.create(mockReq);

    expect(mockQuoteGenerator.generate).toHaveBeenCalledWith('anxious', null);
    expect(mockMoodRepo.create).toHaveBeenCalled();
    expect(mockQuoteRepo.create).toHaveBeenCalled();
    expect(result.data.quote.content).toBe('You are stronger than you think.');
  });
});
```

#### 13.1.7 Coverage Requirements

All backend code must meet these coverage thresholds:

- **Statements:** >= 75%
- **Branches:** >= 75%
- **Functions:** >= 75%
- **Lines:** >= 75%

Excluded from coverage:

- Entry points (`index.ts`, `app.ts`)
- Database setup (`services/database.ts`)
- Repositories (require database integration)
- Routes (integration points)

---

### 13.2 Frontend Test Structure

```
frontend/
├── src/
│   └── components/
│       └── atoms/
│           └── __tests__/
│               └── AppButton.spec.ts
└── tests/
    ├── unit/             # Component unit tests
    ├── integration/      # Feature integration tests
    └── e2e/              # End-to-end tests (Cypress/Playwright)
```

### 13.3 Component Testing

```typescript
// components/atoms/__tests__/AppButton.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppButton from '../AppButton.vue';

describe('AppButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(AppButton, {
      slots: {
        default: 'Click me',
      },
    });
    expect(wrapper.text()).toContain('Click me');
  });

  it('emits click event', async () => {
    const wrapper = mount(AppButton);
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('applies variant class', () => {
    const wrapper = mount(AppButton, {
      props: { variant: 'secondary' },
    });
    expect(wrapper.classes()).toContain('btn--secondary');
  });
});
```

---

## 14. Code Style

### 14.1 Naming Conventions

| Type           | Convention                    | Example                               |
| -------------- | ----------------------------- | ------------------------------------- |
| Vue Components | PascalCase                    | `AppButton.vue`, `MoodCard.vue`       |
| Composables    | camelCase with `use` prefix   | `useAuth.ts`, `useToast.ts`           |
| Stores         | camelCase                     | `auth.ts`, `ui.ts`                    |
| Views          | PascalCase with `View` suffix | `MoodSelectView.vue`                  |
| Utilities      | camelCase                     | `formatDate.ts`                       |

### 14.2 Vue-specific Guidelines

```vue
<!-- ✅ CORRECT - Props are kebab-case in templates -->
<AppButton :is-loading="true" @on-click="handleClick" />

<!-- ✅ CORRECT - Use v-bind shorthand -->
<AppInput :model-value="email" @update:model-value="email = $event" />

<!-- ✅ CORRECT - Use v-model for two-way binding -->
<AppInput v-model="email" />
```

---

## 15. Prompting Guidelines for Claude Code

### 15.1 Creating a New Vue Component

```
Follow the patterns in CLAUDE.md to create a [COMPONENT NAME] component.

Requirements:
- [What it should do]
- [User interactions]

This should be an [atom/molecule/organism] because [reason].

Create:
1. Component in frontend/src/components/[level]/
2. Add Vue Query composable if it needs server data
3. Update Pinia store if it needs client state
4. Add translations in frontend/src/i18n/locales/
5. Write tests

Remember:
- Use Tailwind CSS with theme colors
- Use existing atoms/molecules where possible
- All text must use translation keys (no hardcoded text)
- Use Vue Query for server state, Pinia for client state
- Follow atomic design rules
- Use <script setup lang="ts"> syntax
```

### 15.2 Creating a New View

```
Follow the patterns in CLAUDE.md to create a [VIEW NAME] view.

Route: /[path]
Purpose: [What it does]

Create:
1. View in frontend/src/views/[section]/
2. Add route in frontend/src/router/
3. Add any needed composables
4. Add translations
5. Add navigation guard logic if needed

Remember:
- Views can use all composables and stores
- Use appropriate layout template
- Handle loading and error states
- Include navigation guards for auth
```

### 15.3 Adding a New Mood Type

```
Follow the patterns in CLAUDE.md to add a new mood type: [MOOD NAME].

Update:
1. MOOD_TYPES array in shared/src/types/mood.ts
2. Emoji mapping in AppMoodIcon.vue
3. Translation keys in all locale files
4. Prompt templates if mood-specific handling is needed
5. Tests
```

### 15.4 Modifying the Quote Generation Prompt

```
Follow the patterns in CLAUDE.md to update the quote generation prompt.

Requirements:
- [What to change about the prompt]
- [Expected behavior change]

Update:
1. Prompt template in backend/src/services/llm/prompts/
2. Version the prompt change
3. Update tests for the new prompt behavior
4. Test with multiple mood types to ensure quality
```

---

## 16. Common Tasks

### 16.1 Adding a New View

1. Create view component in `frontend/src/views/`
2. Add route in `frontend/src/router/`
3. Add any needed translations
4. Configure route meta for auth guards

### 16.2 Adding a New Atom Component

1. Create component in `frontend/src/components/atoms/`
2. Export from `frontend/src/components/atoms/index.ts`
3. Use `App` prefix for naming
4. Add Tailwind styles using theme colors
5. Write unit tests

### 16.3 Adding API Integration

1. Add query composable in `frontend/src/services/queries/`
2. Use Vue Query patterns for data fetching
3. Handle loading and error states in components

### 16.4 Adding a New Mood Type

1. Add to `MOOD_TYPES` in `shared/src/types/mood.ts`
2. Add emoji mapping in `AppMoodIcon.vue`
3. Add translation keys in all locale files
4. Test the full flow: selection → API → quote generation

### 16.5 Updating LLM Prompts

1. Edit prompt template in `backend/src/services/llm/prompts/`
2. Version the change
3. Test with various moods and notes
4. Verify quote quality and tone

---

## Quick Reference

### Request Flow

```
Route → Controller → Service/Entity → Repository → Entity → Controller → Route → JSON
```

### Required for Every Database Query

```typescript
where: { ..., userId }
```

### Vue Component Checklist

- [ ] Uses `<script setup lang="ts">`
- [ ] Props typed with `defineProps<Props>()`
- [ ] Events typed with `defineEmits<Events>()`
- [ ] Tailwind CSS with theme colors
- [ ] Translations for all text
- [ ] At correct atomic level
- [ ] Unit tests included

### Checklist for New Features

- [ ] User data isolation (userId in all queries)
- [ ] Input validation with Zod
- [ ] Error handling with custom errors
- [ ] Unit and integration tests
- [ ] Translations for UI text
- [ ] Tailwind theme colors (no hardcoded styles)
- [ ] Vue Query for server state
- [ ] Consider AI integration opportunities

---

_This document is the source of truth for Self-Mastery development. When in doubt, refer here._
