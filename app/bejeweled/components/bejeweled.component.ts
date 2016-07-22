
import { Component, OnInit } from '@angular/core';
import { BEJEWELED_SETTINGS } from '../data/settings.data';
import { BejeweledGameBoard } from '../models/bejeweled-game-board';
import { GemService } from '../lib/gem.service';

declare var createjs: any;
declare var document: any;

@Component ({
    providers: [GemService],
    selector: 'game-bejeweled',
    templateUrl: 'app/bejeweled/static/html/bejeweled.component.html'
})
export class BejeweledComponent implements OnInit {

    board: BejeweledGameBoard;
    stage: any;

    constructor ( private gemService: GemService ) {}

    ngOnInit () {

        this.board = new BejeweledGameBoard ();
        this.board.initialize ();
        this.stage = new createjs.Stage ( document.getElementById
            ( 'bejeweled-canvas' ) );

        for ( var i = 0; i < 8; ++i )
        {
            for ( var j = 0; j < 8; ++j )
                this.stage.addChild ( this.gemService.getGem (
                    this.board.board [i] [j], j * 50, i * 50 ) );
        }

        this.stage.update ();
    }
};
