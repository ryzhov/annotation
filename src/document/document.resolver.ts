import { ResolveFn } from '@angular/router';
import { delay, of } from 'rxjs';
import type { IDocument } from './model';
import { getDocumentMock } from './document.mock';


export const documentResolver: ResolveFn<IDocument> = route => {
  const id = Number(route.paramMap.get('id'));

  // -- mock api response in 0.3 sec delay --
  return of(getDocumentMock(id)).pipe(delay(300));
};
