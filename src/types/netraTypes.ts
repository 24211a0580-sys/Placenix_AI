export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface LanguageOption {
  code: string;
  label: string;
  native: string;
  placeholder: string;
}
