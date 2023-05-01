export interface Category {
  id: string;
  text: '전체' | '학업' | '오락' | '비즈니스' | '개발' | '기타';
  value: 'ALL' | 'STUDY' | 'FUN' | 'BUSINESS' | 'PROGRAMMING' | 'ETC';
}

export interface Sort {
  id: string;
  text: '좋아요' | '조회수' | '최신순';
  value: 'likeCnt' | 'hit' | 'regDt';
}

export interface Prompt {
  category: Category['value'];
  description: string;
  example: string;
  hit: number;
  likeCnt: number;
  originalPromptUuid: string | null;
  prefix: string | null;
  promptUuid: string;
  regDt: number;
  suffix: string | null;
  title: string;
  updDt: number;
}

export interface SearchResult {
  extensionSearchPromptList: Array<Prompt>;
  totalPageCnt: number;
  totalPromptsCnt: number;
}