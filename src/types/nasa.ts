export interface APODData {
  title: string;
  explanation: string;
  url: string;
  mediaType: 'image' | 'video' | 'other';
  date: string;
}

export interface NASAAPODResponse {
  title: string;
  explanation: string;
  url: string;
  media_type: string;
  date: string;
}