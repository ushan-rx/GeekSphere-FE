import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    console.log('Received form data keys:', Array.from(formData.keys()));

    const response = await axios.post('http://localhost:8080/api/posts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...corsHeaders(),
      }
    });

    console.log('Backend response:', response.data);

    return NextResponse.json(response.data, {
      headers: corsHeaders(),
    });
  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });

    return NextResponse.json(
      { 
        error: 'Failed to create post',
        details: error.response?.data || error.message
      },
      { 
        status: error.response?.status || 500,
        headers: corsHeaders(),
      }
    );
  }
} 