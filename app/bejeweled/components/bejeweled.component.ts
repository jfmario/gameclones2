
import { Component, OnInit } from '@angular/core';
import { BEJEWELED_SETTINGS } from '../data/settings.data';
import { BejeweledGameBoard } from '../models/bejeweled-game-board';
import { BejeweledGameState } from '../models/bejeweled-game-state';
import { BoardLocation } from '../models/board-location';
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

    chosenGem: any = null;
    chosenGemLocation: BoardLocation = null;
    chosenGemMarker: any = null;

    chosenGemType: number = -1;

    drawBoard: any [] [] = [];
    stage: any;

    state: BejeweledGameState = BejeweledGameState.WORKING;

    constructor ( private gemService: GemService ) {}

    private eventToBoardLocation ( event: any )
    {

        var x: number = Math.floor ( event.stageX / 50 );
        var y: number = Math.floor ( event.stageY / 50 );

        return new BoardLocation ( x, y );
    }

    handleGemClick ( event: any )
    {
        if ( this.state == BejeweledGameState.AWAITING_SELECT )
        {
            this.state = BejeweledGameState.WORKING;
            this.chosenGemLocation = this.eventToBoardLocation ( event );
            this.chosenGem = this.drawBoard [this.chosenGemLocation.y]
                [this.chosenGemLocation.x];
            this.chosenGemType = this.board.checkLocation (
                this.chosenGemLocation );
            this.chosenGemMarker = this.gemService.getSelectionMarker (
                this.chosenGemLocation.x * 50, this.chosenGemLocation.y * 50 );
            this.stage.addChild ( this.chosenGemMarker );
            this.stage.update ();
            this.state = BejeweledGameState.AWAITING_SECOND;
        }
        else if ( this.state == BejeweledGameState.AWAITING_SECOND )
        {

            this.state = BejeweledGameState.WORKING;

            var location = this.eventToBoardLocation ( event );
            if ( this.chosenGemLocation.isAdjacent ( location ) )
            {
                // Why does direction always say up???
                // alert ( this.chosenGemLocation.toString () );
                alert ( location.toString () );
                var direction = 'up';
                if ( location.down ().isEqual ( this.chosenGemLocation ) )
                    direction = 'down';
                if ( location.left ().isEqual ( this.chosenGemLocation ) )
                    direction = 'left';
                if ( location.right ().isEqual ( this.chosenGemLocation ) )
                    direction = 'right';
                alert ( direction );
            }
            else
            {

                alert ( "You must choose two adjacent gems." );

                this.stage.removeChild ( this.chosenGemMarker );
                this.chosenGem = null;
                this.chosenGemLocation = null;
                this.chosenGemMarker = null;
                this.chosenGemType = -1;
                this.stage.update ();
                this.state = BejeweledGameState.AWAITING_SELECT;
            }
        }
        else return;
    }

    ngOnInit () {

        this.state = BejeweledGameState.WORKING;
        this.board = new BejeweledGameBoard ();
        this.board.initialize ();
        this.stage = new createjs.Stage ( document.getElementById
            ( 'bejeweled-canvas' ) );
        var self = this;

        for ( var i = 0; i < 8; ++i )
        {

            this.drawBoard.push ( [] );

            for ( var j = 0; j < 8; ++j )
            {
                var gem = this.gemService.getGem (
                    this.board.board [i] [j], j * 50, i * 50 );
                gem.addEventListener ( 'click', function ( event: any )
                {
                    self.handleGemClick ( event );
                });
                this.drawBoard [i].push ( gem );
                this.stage.addChild ( gem );
            }
        }

        this.state = BejeweledGameState.AWAITING_SELECT;
        this.stage.update ();
    }
};
