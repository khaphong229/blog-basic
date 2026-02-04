export interface TranslationInput {
  title: string
  excerpt: string
  content: string
  tags: string[]
}

export interface TranslationResult {
  translatedTitle: string
  translatedExcerpt: string
  translatedContent: string
  translatedTags: string[]
}

export interface TranslationError {
  error: string
}

export async function translatePost(input: TranslationInput): Promise<TranslationResult> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const errorData: TranslationError = await response.json()
    throw new Error(errorData.error || "Translation failed")
  }

  return response.json()
}
