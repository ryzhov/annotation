import { InjectionToken } from '@angular/core';
import { Routes } from '@angular/router';
import { documentResolver } from './document/document.resolver';

export const SCALE_LIMITS = new InjectionToken<{ max: number; min: number}>('SCALE_LIMITS');

export const routes: Routes = [
  {
    path: 'document/:id',
    loadComponent: () => import('./document/document.component').then(m => m.DocumentComponent),
    runGuardsAndResolvers: 'pathParamsChange',

    resolve: {
      document: documentResolver
    },

    providers: [
      {
        provide: SCALE_LIMITS,
        useValue: { max: 150, min: 50 }
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/document/1'
  }
];
