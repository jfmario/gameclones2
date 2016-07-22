
import { provideRouter, RouterConfig } from '@angular/router';
import { BejeweledComponent } from '../bejeweled/components/bejeweled.component';

const routes: RouterConfig = [
    {
        component: BejeweledComponent,
        path: 'bejeweled'
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/bejeweled'
    }
];
export const appRouterProviders = [
    provideRouter ( routes )
];
