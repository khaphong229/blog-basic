---
name: add-translation
description: Add new translations to the language context and update types
---

# Adding Translations

## 1. Update Context
Edit `context/language-context.tsx`:

```typescript
const translations = {
  en: {
    // ...existing
    "new.key": "New Value in English",
  },
  vi: {
    // ...existing
    "new.key": "Giá trị mới tiếng Việt",
  }
}
```

## 2. Usage
```tsx
const { t } = useLanguage()
<span>{t("new.key")}</span>
```

## 3. Rules
- Keys must be identical in both languages.
- Use dot notation for nested keys if applicable.
