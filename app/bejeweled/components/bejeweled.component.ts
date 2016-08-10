
import { Component, OnInit } from '@angular/core';
import { BEJEWELED_SETTINGS } from '../data/settings.data';
import { DIRECTION_MOVES } from '../data/direction_moves.data';
import { DIRECTION_OPPOSITES } from '../data/direction_opposites.data';
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

    private animateCollapse ()
    {
        var record = this.board.collapse ();
        var collapseRecord = record.collapseRecord;
        var fallRecord = record.fallRecord;
        var newRecord = record.newRecord;

        console.log ( collapseRecord );
        // make the gems disappear
        for ( var i = 0; i < collapseRecord.length; ++i )
        {
            createjs.Tween.get ( this.drawBoard
                [collapseRecord[i][0]] [collapseRecord[i][1]] )
                .wait ( 400 )
                .to ( { alpha: 0 }, 100 );
        }

        // animate the collapse
        for ( var i = 0; i < fallRecord.length; ++i )
        {
            createjs.Tween.get ( this.drawBoard
                [fallRecord[i].source.y] [fallRecord[i].source.x] )
                .wait ( 500 )
                .to ( { y: 50 * ( fallRecord[i].dest.y -
                    fallRecord[i].source.y ) }, 300 );
        }

        console.log ( newRecord );
        for ( var i = 0; i < newRecord.length; ++i )
        {
            var gem = this.gemService.getGem (
                newRecord [i].gemType, newRecord [i].loc.x * 50,
                newRecord [i].loc.y * 50 );
            gem.alpha = 0;
            this.stage.addChild ( gem );
            createjs.Tween.get ( gem ).wait ( 900 )
                .to ( { alpha: 1 }, 200 );
        }

        var self = this;

        // must re initialize everything
        setTimeout ( function ()
        {
            self.resetDrawBoard ();
            self.state = BejeweledGameState.AWAITING_SELECT;
        }, 1100 );
    }
    private eventToBoardLocation ( event: any )
    {

        var x: number = Math.floor ( event.stageX / 50 );
        var y: number = Math.floor ( event.stageY / 50 );

        return new BoardLocation ( x, y );
    }
    private resetDrawBoard ()
    {

        this.drawBoard = [];
        this.stage.removeAllChildren ();
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

        createjs.Ticker.addEventListener ( 'tick', function ()
        {
            self.stage.update ();
        });
        this.stage.update ();
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

            var self = this;
            this.state = BejeweledGameState.WORKING;
            var location = this.eventToBoardLocation ( event );
            if ( this.chosenGemLocation.isAdjacent ( location ) )
            {

                // alert ( this.chosenGemLocation.toString () );
                var direction = 'up';
                if ( location.down ().isEqual ( this.chosenGemLocation ) )
                    direction = 'down';
                if ( location.left ().isEqual ( this.chosenGemLocation ) )
                    direction = 'left';
                if ( location.right ().isEqual ( this.chosenGemLocation ) )
                    direction = 'right';

                var isValid1 = this.board.checkLocationForCollapse ( location,
                    this.chosenGemType, direction );
                var isValid2 = this.board.checkLocationForCollapse (
                    this.chosenGemLocation,
                    this.board.checkLocation ( location ),
                    DIRECTION_OPPOSITES [direction] );
                var isValid = isValid1 || isValid2;

                if ( isValid )
                {

                    var otherGem = this.drawBoard [location.y] [location.x];
                    this.drawBoard [location.y] [location.x] = this.drawBoard
                        [this.chosenGemLocation.y] [this.chosenGemLocation.x];
                    this.drawBoard [this.chosenGemLocation.y]
                        [this.chosenGemLocation.x] = otherGem;
                    this.board.switch ( this.chosenGemLocation, location );

                    // switch the gems
                    createjs.Tween.get ( this.chosenGem ).to (
                        DIRECTION_MOVES [direction], 300 );
                    createjs.Tween.get ( otherGem ).to (
                        DIRECTION_MOVES [ DIRECTION_OPPOSITES [direction] ],
                        300 );

                    this.animateCollapse ();
                }
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
        this.resetDrawBoard ();
        this.state = BejeweledGameState.AWAITING_SELECT;
    }
};
