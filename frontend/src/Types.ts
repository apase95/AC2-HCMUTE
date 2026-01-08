export interface IconButtonType {
    icon?: React.ReactNode;
    title: string;
    url: string;
    onClick?: () => void;
}

export interface Author {
    _id: string;
    displayName: string;
    avatarURL: string;
}

export interface BlogType {
    _id: string;
    title: string;
    content: string;
    coverImage: string;
    author: Author;
    tags: string[];
    views: number;
    readTime: string;
    subscription?: string;
    createdAt: string;
}

export interface DocumentType {
    _id: string;
    title: string;
    content: string;
    coverImage: string;
    author: Author;
    tags: string[];
    views: number;
    readTime: string;
    subscription?: string;
    createdAt: string;
}

export interface ExamType {
    _id: string;
    title: string;
    content: string;
    coverImage: string;
    author: Author;
    tags: string[];

    rating?: number;
    ratingsCount?: number;
    submittedCount?: number;
    totalTime?: number;
    language?: string;
    updatedAt: string;
    createdAt: string;
    completionCount?: number;

    parts: ExamPart[];
    reviews?: Review[];
    userScores?: Record<string, number | { total: number; parts: Record<string, number> }>;
}

export interface Review {
    _id: string;
    user: User;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface CommentType {
    _id: string;
    content: string;
    author: {
        _id: string;
        displayName: string;
        avatarURL?: string;
    };
    createdAt: string;
}

export interface User {
    _id: string;
    displayName: string;
    email: string;
    avatarURL?: string;
    bio?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    education?: string;
    country?: string;
    province?: string;
    role?: "admin" | "user";
}

export interface LoginResponse {
    message: string;
    accessToken: string;
    user: User;
}

export interface RegisterPayload {
    password: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface Question {
    id: number | string;
    text: string;
    type: "single" | "multiple";
    options: {
        id: string;
        text: string;
        label?: string;
    }[];
    correctAnswers: string[];
    explanation?: string;
}

export interface ExamPart {
    _id: string;
    title: string;
    questions: Question[];
}

export interface CommentType {
    _id: string;
    content: string;
    author: Author;
    createdAt: string;
    relatedId?: string;
    onModel?: string;
}

export interface PaginationMetadata {
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMetadata;
}
