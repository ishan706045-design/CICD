// src/types/index.ts

// This file exports TypeScript interfaces and types used throughout the application.

export interface EstimateRequest {
    text: string;
    language: string;
}

export interface EstimateResponse {
    words_estimate: number;
    per_lang: Record<string, number>;
    credits_required: number;
    allowance_remaining: number;
}

export interface IdempotencyKey {
    key: string;
}

export interface HmacAuthHeaders {
    'X-Api-Key': string;
    'X-Signature': string;
    'X-Timestamp': string;
    'X-Nonce': string;
}