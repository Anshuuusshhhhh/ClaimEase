import { NextResponse } from 'next/server'

const botResponses = [
  "I'm here to help you with your health insurance claim. What specific information do you need?",
  "Could you provide more details about your claim?",
  "I understand you have a question about your claim. How can I assist you further?",
  "Is there any additional information you can share about your medical condition or treatment?",
  "I'm checking our database for information related to your query. Is there anything else you'd like to know?",
  "Thank you for providing that information. Is there anything else you'd like to add to your claim?",
  "I'm here to guide you through the claim process. What's your next question?",
  "If you have any documentation related to your claim, please make sure to upload it in the designated area.",
  "Your health and well-being are important to us. How else can I assist you with your claim today?",
  "Remember, the more information you provide, the better we can assist you with your claim. What else would you like to share?"
]

export async function POST(req: Request) {
  const { message } = await req.json()

  // Simple logic to choose a random response
  const response = botResponses[Math.floor(Math.random() * botResponses.length)]

  // In a real application, you would process the message and generate a relevant response here

  return NextResponse.json({ response })
}

