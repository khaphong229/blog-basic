import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: NextRequest) {
  try {
    // Check API Key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { title, excerpt, content, tags } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields (title, content)" },
        { status: 400 }
      )
    }

    // Get model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Construct prompt
    const prompt = `
      You are a professional translator. Translate the following blog post content from Vietnamese to English.
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
      - Translate "translatedTags" to English equivalents.
      - Keep "translatedContent" in Markdown format if the original is Markdown.
      - Do not include any explanation, only the JSON object.
    `

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from response (remove code block markers if any)
    const jsonString = text.replace(/```json\n?|\n?```/g, "").trim()
    
    let translatedData
    try {
      translatedData = JSON.parse(jsonString)
    } catch (e) {
      console.error("Failed to parse Gemini response:", text)
      return NextResponse.json(
        { error: "Failed to parse translation response" },
        { status: 500 }
      )
    }

    return NextResponse.json(translatedData)
  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json(
      { error: "Internal server error during translation" },
      { status: 500 }
    )
  }
}
