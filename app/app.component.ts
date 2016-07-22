import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { GAMES } from './global/data/games.data';

@Component ( {
    directives: [ROUTER_DIRECTIVES],
    selector: 'my-app',
    templateUrl: 'app/global/static/html/app.component.html'
})
export class AppComponent {
    games = GAMES;
};
