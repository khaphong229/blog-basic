---
name: create-form
description: Create a type-safe form using React Hook Form, Zod, and Shadcn UI components
---

# Creating a Form

## 1. Imports & Schema
Define the validation schema first using Zod.

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
})

type FormValues = z.infer<typeof formSchema>
```

## 2. Component Structure
Setup the form hook and submit handler.

```tsx
export default function ProfileForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  })

  function onSubmit(values: FormValues) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Form Fields Go Here */}
        
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## 3. Checklist
- [ ] Schema defined with Zod
- [ ] Types inferred from schema
- [ ] `use client` directive included
- [ ] Shadcn `<Form>` wrapper used
- [ ] Fields wrapped in `<FormField>`
