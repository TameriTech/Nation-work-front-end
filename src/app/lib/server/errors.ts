// lib/server/errors.ts
import { NextResponse } from 'next/server';
import { BackendError } from './backend';

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof BackendError) {
    return NextResponse.json(
      { 
        error: error.message,
        field: error.field 
      },
      { status: error.status }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Erreur serveur inconnue' },
    { status: 500 }
  );
}
