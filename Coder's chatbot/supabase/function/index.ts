import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId } = await req.json();
    console.log('Received message:', message);

    // Validate that the question is coding-related
    const validationPrompt = `You are a coding question validator. Your job is to determine if a question is about programming/coding topics.

    Question: "${message}"

    Return "YES" if the question is about:
    - Programming languages (Python, JavaScript, Java, C++, etc.)
    - Software development, debugging, or code review
    - Algorithms, data structures, or computer science concepts
    - Web development, mobile apps, or software tools
    - Code examples, syntax, or programming concepts
    - APIs, databases, frameworks, or libraries
    
    Return "NO" ONLY if the question is clearly about non-technical topics like:
    - Weather, cooking, sports, entertainment
    - General knowledge not related to technology
    - Personal advice, jokes, or casual conversation
    
    Even vague coding requests like "give me code" or "help with programming" should return YES.
    
    Respond with ONLY "YES" or "NO".`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // First check if question is coding-related
    const validationResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'user', content: validationPrompt }
        ],
      }),
    });

    if (!validationResponse.ok) {
      const errorText = await validationResponse.text();
      console.error('Validation API error:', validationResponse.status, errorText);
      
      if (validationResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (validationResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Validation failed: ${errorText}`);
    }

    const validationData = await validationResponse.json();
    const isValid = validationData.choices[0]?.message?.content?.trim().toUpperCase() === 'YES';

    console.log('Question validation result:', isValid);

    if (!isValid) {
      return new Response(
        JSON.stringify({ 
          error: 'non_coding_question',
          message: '⚠️ This chatbox is exclusively for coding-related questions. Please ask a question about programming, software development, algorithms, or any technical computer science topic.'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // If valid, get the answer from AI
    const answerPrompt = `You are an expert programming assistant in Coder's Chatbox. Provide a clear, accurate, and helpful answer to this coding question. Include code examples when relevant. If you're not completely certain about the answer, provide relevant documentation links or resources.

Question: ${message}

Provide a comprehensive answer with:
1. Direct answer to the question
2. Code examples if applicable
3. Best practices or important considerations
4. Links to official documentation when relevant`;

    const answerResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert programming assistant. Provide accurate, helpful coding answers with examples.' },
          { role: 'user', content: answerPrompt }
        ],
      }),
    });

    if (!answerResponse.ok) {
      const errorText = await answerResponse.text();
      console.error('Answer API error:', answerResponse.status, errorText);
      throw new Error(`Answer generation failed: ${errorText}`);
    }

    const answerData = await answerResponse.json();
    const answer = answerData.choices[0]?.message?.content;

    console.log('Generated answer successfully');

    return new Response(
      JSON.stringify({ 
        answer,
        isCodingRelated: true
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'internal_error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});