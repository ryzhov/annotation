
export interface IPage {
  number: number;
  imageUrl: string;
}

export interface IDocument {
  name: string;
  pages: IPage[];
}
