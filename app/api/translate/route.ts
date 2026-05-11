import { NextRequest, NextResponse } from "next/server"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

const MODEL_FALLBACKS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"]

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { title, excerpt, content, tags, sourceLang = "vi" } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields (title, content)" },
        { status: 400 }
      )
    }

    const isViToEn = sourceLang === "vi"
    const fromLang = isViToEn ? "Vietnamese" : "English"
    const toLang = isViToEn ? "English" : "Vietnamese"

    const prompt = `You are a professional translator. Translate the following blog post content from ${fromLang} to ${toLang}.
Ensure the tone remains professional, engaging, and suitable for a tech/personal blog.

Input Data:
1. Title: "${title}"
2. Excerpt: "${excerpt || ""}"
3. Content: "${content}"
4. Tags: ${JSON.stringify(tags || [])}

Output must be a valid JSON object with the following structure:
{
  "translatedTitle": "...",
  "translatedExcerpt": "...",
  "translatedContent": "...",
  "translatedTags": ["...", "..."]
}

Important:
- Translate "translatedTags" to ${toLang} equivalents.
- Keep "translatedContent" in Markdown format if the original is Markdown.
- Do not include any explanation, only the JSON object.`

    let lastError = ""
    for (const model of MODEL_FALLBACKS) {
      try {
        console.log(`[Translate API] Trying model: ${model}`)
        const response = await fetch(GROQ_API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            response_format: { type: "json_object" },
          }),
        })

        if (!response.ok) {
          const errText = await response.text()
          throw new Error(`Groq API error (${response.status}): ${errText.substring(0, 200)}`)
        }

        const data = await response.json()
        const text = data.choices?.[0]?.message?.content || ""

        console.log(`[Translate API] Success with ${model}! Response length: ${text.length}`)

        const jsonString = text.replace(/```json\n?|\n?```/g, "").trim()
        const translatedData = JSON.parse(jsonString)

        return NextResponse.json(translatedData)
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e)
        console.log(`[Translate API] Model ${model} failed: ${errorMsg.substring(0, 100)}`)
        lastError = errorMsg

        if (errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("rate") || errorMsg.includes("500")) {
          continue
        }
        break
      }
    }

    return NextResponse.json(
      { error: `Translation failed: ${lastError.substring(0, 200)}` },
      { status: 500 }
    )
  } catch (error) {
    console.error("[Translate API] Error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: `Translation failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    )
  }
}
