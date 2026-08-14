export interface Resume {
  id?: number;
  userId: number;
  fileName: string;
  filePath?: string;
  status: string;
}

export interface ResumeUploadResponse {
  id: number;
  fileName: string;
  status: string;
}

export interface ExtractedLanguagesResponse {
  extractedLanguages: string[];
}

export interface ConfirmLanguagesRequest {
  languages: string[];
}