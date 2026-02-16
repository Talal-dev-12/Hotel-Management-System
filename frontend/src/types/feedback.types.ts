export interface Feedback {
  _id: string;
  guestId: string | {
    _id: string;
    name: string;
    email: string;
  };
  reservationId?: string;
  rating: {
    overall: number;
    cleanliness?: number;
    service?: number;
    amenities?: number;
    valueForMoney?: number;
  };
  comment?: string;
  improvements?: string;
  wouldRecommend: boolean;
  status: 'Pending' | 'Reviewed' | 'Published';
  response?: {
    message: string;
    respondedBy: string;
    respondedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackData {
  reservationId?: string;
  rating: {
    overall: number;
    cleanliness?: number;
    service?: number;
    amenities?: number;
    valueForMoney?: number;
  };
  comment?: string;
  improvements?: string;
  wouldRecommend?: boolean;
}

export interface RespondToFeedbackData {
  message: string;
}

export interface FeedbackFilters {
  status?: string;
  minRating?: number;
  maxRating?: number;
  page?: number;
  limit?: number;
}