export interface SendEmailRequest {
  title: string;
  sender: string;
  content: string;
}

export interface SendEmailResponse {
  message: string;
}

export interface ErrorResponse {
  message: string;
}
