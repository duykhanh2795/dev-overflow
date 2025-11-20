import { NextResponse } from "next/server";

declare global {
  interface Tag {
    _id: string;
    name: string;
    questions?: number;
  }

  interface Author {
    _id: string;
    name: string;
    image: string;
  }
  interface Badges {
    GOLD: number;
    SILVER: number;
    BRONZE: number;
  }
  interface Question {
    _id: string;
    title: string;
    content: string;
    tags: Tag[];
    author: Author;
    createdAt: Date;
    upvotes: number;
    downvotes: number;
    answers: number;
    views: number;
  }
  interface Comment {
    _id: string;
    targetId: string;
    author: Author;
    content: string;
    type: "question" | "answer";
    createdAt: Date;
    replyToUser?: string;
    upvotes: number;
    edited: boolean;
    page?: number;
  }
  interface QuestionInfo {
    _id: string;
    title: string;
    content: string;
  }
  interface Answer {
    _id: string;
    author: Author;
    content: string;
    createdAt: Date;
    upvotes: number;
    downvotes: number;
    question: QuestionInfo;
    page?: number;
    editHistory?: {
      content: string;
      editedAt: Date;
    }[];
  }
  interface userNotification {
    _id: string;
    targetId: string;
    refId?: string;
    sender: Author;
    receiver: Author;
    type: "question" | "answer";
    message: string;
    createdAt: Date;
    isRead: boolean;
    page?: number;
  }
  interface AnswerNotification extends userNotification {
    // answerId?: string;
    page?: number;
  }
  interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    bio?: string;
    image?: string;
    location?: string;
    portfolio?: string;
    reputation?: number;
    createdAt: Date;
  }
  interface Collection {
    _id: string;
    author: string | Author;
    question: Question;
  }
  interface BadgeCounts {
    GOLD: number;
    SILVER: number;
    BRONZE: number;
  }
  interface GlobalSearchedItem {
    id: string;
    type: "question" | "answer" | "user" | "tag";
    title: string;
  }
  // type ActionResponse<T = null> = {
  //   success: boolean;
  //   data?: T;
  //   error?: {
  //     message: string;
  //     details?: Record<string, string[]>;
  //   };
  //   status?: number;
  // };

  // type SuccessResponse<T = null> = ActionResponse<T> & {
  //   success: true;
  // };
  // type ErrorResponse = ActionResponse<undefined> & {
  //   success: false;
  // };

  // type APIErrorResponse = NextResponse<ErrorResponse>;
  // type APIResponse<T = null> = NextResponse<
  //   SuccessResponse<T> | APIErrorResponse
  // >;
  type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    error?: {
      message: string;
      details?: Record<string, string[]>;
    };
    status?: number;
  };

  type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
  type ErrorResponse = ActionResponse<undefined> & { success: false };

  type APIErrorResponse = NextResponse<ErrorResponse>;
  type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;
  interface PaginatedSearchParams {
    page?: number;
    pageSize?: number;
    query?: string;
    filter?: string;
    sort?: string;
  }
}
declare global {
  interface Window {
    puter: any;
  }
}
