
export interface IPage {
  number: number;
  imageUrl: string;
}

export interface IDocument {
  name: string;
  pages: IPage[];
}

export interface IAnnotation {
  id: string;
  page: number;
  x: number; // percentage
  y: number; // percentage
  text: string;
}
export type IAnnotationChanges = Omit<Partial<IAnnotation>, 'id'> & Pick<IAnnotation, 'id'>;
