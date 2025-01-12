import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  
  const response = await fetch('http://localhost:5000/diagnose', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to get diagnosis' }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data)
}

