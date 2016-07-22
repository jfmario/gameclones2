import { bootstrap } from '@angular/platform-browser-dynamic';

// import { createjs } from './global/middleware/createjs.declare';
import { appRouterProviders } from './global/app.router';
import { AppComponent } from './app.component';

bootstrap( AppComponent, [ appRouterProviders ] );

declare var createjs: any;
console.log ( createjs );
