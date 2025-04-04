// app/api/prompt/route.ts
const GOOGLE_API_KEY='AIzaSyAeWxLxN_2lOsvRo8v5S7_VncHfcLODZhI'
const GOOGLE_SEARCH_ENGINE_ID='c0cb9ca646a594150'
const GEMINI_API_KEY='AIzaSyBBXoyDKqLZu80BwMbGBLvVkMKgFtO2nPQ'
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";



const cleanText = (html: string) => {
    return html
      .replace(/<[^>]+>/g, ' ') // Remove HTML tags
      .replace(/&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g, ' ') // Replace common HTML entities
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim();
};

const formatSearchResults = (items: any[]) => {
    const output =  items.map((item, index) => {
      const title = item.title;
      const snippet = item.htmlSnippet;
      const url = item.link;
      
      return `[Source ${index + 1}] ${title}
                        ${snippet.slice(0, 300)}... // Truncate for token efficiency
                        URL: ${url}`;
    }).join('\n\n');

    // console.log('Formatted Search Results:', output);
    return output;

  };
  

export async function POST(req: NextRequest) {
    
  const body = await req.json();
  const prompt = body.prompt;
  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

    const googleApiKey = GOOGLE_API_KEY;
    const googleSearchEngineId = GOOGLE_SEARCH_ENGINE_ID;
    
    const searchResponse = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleSearchEngineId}&q=${encodeURIComponent(prompt)}`
    );
    const searchData = await searchResponse.json();

    const searchContext = formatSearchResults(searchData.items || []);


    // console.log('Google Search Response:', searchContext);

    const messages = [
        {
          role: "system",
          content: `You are a knowledgeable assistant. Use the following search results to answer questions. 
                    Cite sources using [1], [2], etc., and include URLs when relevant. Use links if you want to get more information.
                    If the search results are not relevant, say "I don't know".`
        },
        {
          role: "user",
          content: `Question: ${prompt}\n\nSearch Results:\n${searchContext}`
        }
    ];

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const generationPrompt = `
      Use the following search results to answer this question: ${prompt}
      \n\nSearch Results:\n${searchContext}
      \n\nFormat your answer with:
      - Clear paragraph response
      - Source citations like [1], [2], etc.
      - List of sources with URLs at the end
      - If unsure, state "I couldn't find definitive information"
    `;

    const result = await model.generateContent(generationPrompt);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini Response:', text);
    
    
  

  try {
    const result = `You said: ${prompt}`;
    // await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate delay
    return NextResponse.json({ result:text });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
