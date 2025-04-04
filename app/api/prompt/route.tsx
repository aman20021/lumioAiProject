// app/api/prompt/route.ts
const GOOGLE_API_KEY='AIzaSyAeWxLxN_2lOsvRo8v5S7_VncHfcLODZhI'
const GOOGLE_SEARCH_ENGINE_ID='c0cb9ca646a594150'
const GEMINI_API_KEY='AIzaSyBBXoyDKqLZu80BwMbGBLvVkMKgFtO2nPQ'
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

interface SearchItem {
    title: string;
    link: string;
    snippet: string;
    htmlTitle: string;
    htmlSnippet: string;
  }
  
interface GoogleSearchResponse {
    items?: SearchItem[];
  }
  



const formatSearchResults = (items: SearchItem[]) => {
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
  try{
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
    const searchData: GoogleSearchResponse = await searchResponse.json();

    const searchContext = formatSearchResults(searchData.items || []);


    // console.log('Google Search Response:', searchContext);


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
    return NextResponse.json({ result: text }, { status: 200 });

    
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    
    }
}
