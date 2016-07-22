
import { BEJEWELED_SETTINGS } from '../data/settings.data';

export class BejeweledGameBoard {

    public board: number [][] = [];

    private collapse ()
    {

        var collapseRecord: any = [];
        // find all gems to destroy
        for ( var i = 0; i < 8; ++i )
        {
            for ( var j = 0; j < 8; ++j )
            {

                var currentGemType = this.board [i] [j];
                var downCount = 1;
                var rightCount = 1;
                for ( var k = i + 1; k < 8; ++k )
                {
                    if ( this.board [k] [j] == currentGemType ) ++downCount;
                    else break;
                }

                if ( downCount >= 3 )
                {
                    for ( var l = i; l <= i + downCount - 1; ++l )
                    {
                        collapseRecord.push ( [ l, j, this.board [l] [j] ] );
                    }
                }

                for ( var k = j + 1; k < 8; ++k )
                {
                    if ( this.board [i] [k] == currentGemType ) ++rightCount;
                    else break;
                }

                if ( rightCount >= 3 )
                {
                    for ( var l = j; l <= j + rightCount - 1; ++l )
                        collapseRecord.push ( [ i, l, this.board [i] [l] ] );
                }
            }
        }
        // mark all gems to destroy
        for ( var i = 0; i < collapseRecord.length; ++i )
        {
            this.board [collapseRecord[i][0]] [collapseRecord[i][1]] = 0;
        }

        if ( collapseRecord.length > 0 )
        {
            // walk all gems down
            for ( var i = 7; i >= 0; --i )
            {
                while ( this.board [i].indexOf ( 0 ) != -1 )
                {
                    for ( var j = 0; j < 8; ++j )
                    {
                        if ( this.board [i] [j] == 0 )
                        {
                            for ( var k = i; k > 0; --k )
                                this.board [k] [j] =
                                    this.board [ k - 1 ] [ j ];
                            this.board [0] [j] = Math.floor (
                                Math.random () *
                                BEJEWELED_SETTINGS.NUMGEMTYPES ) + 1;
                        }
                    }
                }
            }
        }
        return collapseRecord;
    }
    hasMoves ()
    {
        for ( var i = 0; i < 6; ++i )
        {
            for ( var j = 0; j < 6; ++j )
            {
                var a = 1;
            }
        }
    }
    initialize () {

        for ( var i = 0; i < 8; ++i )
        {

            this.board.push ( [] );

            for ( var j = 0; j < 8; ++j )
            {
                var gemType: number = Math.floor ( Math.random () *
                    BEJEWELED_SETTINGS.NUMGEMTYPES ) + 1;
                this.board [i].push ( gemType );
            }
        }

        // get out of collapsible state
        while ( this.collapse ().length > 0 )continue;
    }
}
