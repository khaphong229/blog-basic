# Form Validation Reference

React Hook Form + Zod patterns used in this project.

## Dependencies
- `react-hook-form`
- `@hookform/resolvers`
- `zod`

## Basic Form Pattern

```typescript
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// 1. Define Zod schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Invalid email"),
  content: z.string().min(10, "Content too short"),
})

type FormValues = z.infer<typeof formSchema>

// 2. Create form component
export function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      email: "",
      content: "",
    },
  })

  const onSubmit = (values: FormValues) => {
    console.log(values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Title"
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p className="text-destructive text-sm">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      <div>
        <Input
          type="email"
          placeholder="Email"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-destructive text-sm">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Textarea
          placeholder="Content"
          {...form.register("content")}
        />
        {form.formState.errors.content && (
          <p className="text-destructive text-sm">
            {form.formState.errors.content.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}
```

## Common Zod Validations

### Strings
```typescript
z.string()                           // Any string
z.string().min(1, "Required")        // Required field
z.string().max(100, "Too long")      // Max length
z.string().email("Invalid email")    // Email format
z.string().url("Invalid URL")        // URL format
z.string().regex(/pattern/, "Invalid format")
z.string().optional()                // Optional
z.string().nullable()                // Can be null
```

### Numbers
```typescript
z.number()                           // Any number
z.number().min(0, "Must be positive")
z.number().max(100, "Too high")
z.number().int("Must be integer")
z.coerce.number()                    // Coerce string to number
```

### Arrays
```typescript
z.array(z.string())                  // Array of strings
z.array(z.string()).min(1, "Select at least one")
z.array(z.string()).max(5, "Max 5 items")
```

### Enums
```typescript
z.enum(["draft", "published", "archived"])
z.enum(["en", "vi"])
```

### Objects
```typescript
z.object({
  name: z.string(),
  age: z.number(),
})
```

### Custom Validation
```typescript
z.string().refine((val) => val !== "admin", {
  message: "Cannot use 'admin' as name",
})
```

## Blog Post Form Schema

```typescript
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  excerpt: z.string().min(10, "Excerpt too short").max(500),
  content: z.string().min(50, "Content too short"),
  author: z.string().min(1, "Author is required"),
  language: z.enum(["en", "vi"]),
  tags: z.array(z.string()).min(1, "Add at least one tag"),
})

type BlogPostFormValues = z.infer<typeof blogPostSchema>
```

## Comment Form Schema

```typescript
const commentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  content: z.string().min(3, "Comment too short"),
})

type CommentFormValues = z.infer<typeof commentSchema>
```

## useForm Hook API

```typescript
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
})

// Register input
form.register("fieldName")

// Get field value
form.watch("fieldName")

// Set field value
form.setValue("fieldName", "value")

// Reset form
form.reset()

// Check if submitting
form.formState.isSubmitting

// Get errors
form.formState.errors

// Validate specific field
form.trigger("fieldName")
```

## Form with Select

```typescript
<select {...form.register("language")}>
  <option value="en">English</option>
  <option value="vi">Vietnamese</option>
</select>
```

## Async Submit Handler

```typescript
const onSubmit = async (values: FormValues) => {
  try {
    await saveToAPI(values)
    form.reset()
  } catch (error) {
    console.error(error)
  }
}
```
