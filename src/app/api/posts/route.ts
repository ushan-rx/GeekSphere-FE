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
    
    const backendFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        backendFormData.append('file', value); 
      } else {
        backendFormData.append(key, value);
      }
    }

    const response = await axios.post('http://localhost:8080/api/posts/upload', backendFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...corsHeaders(),
      },
    });

    return NextResponse.json(response.data, {
      headers: corsHeaders(),
    });
  } catch (error: any) {
    console.error('Error creating post:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { 
        status: error.response?.status || 500,
        headers: corsHeaders(),
      }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const response = await axios.get('http://localhost:8080/api/posts', {
      headers: corsHeaders(),
    });
    
    return NextResponse.json(response.data, {
      headers: corsHeaders(),
    });
  } catch (error: any) {
    console.error('Error fetching posts:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { 
        status: error.response?.status || 500,
        headers: corsHeaders(),
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('id');
    
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { 
          status: 400,
          headers: corsHeaders(),
        }
      );
    }

    await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
      headers: corsHeaders(),
    });
    
    return NextResponse.json(
      { success: true },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    console.error('Error deleting post:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { 
        status: error.response?.status || 500,
        headers: corsHeaders(),
      }
    );
  }
} 