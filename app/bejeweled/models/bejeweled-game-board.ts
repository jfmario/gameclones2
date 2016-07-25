
import { BEJEWELED_SETTINGS } from '../data/settings.data';
import { BoardLocation } from './board-location';

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
    /**
     * Checks the gem type at a given board location.
     * @param   {BoardLocation} location The location to check
     * @returns {number}        The gem type at that location
     */
    checkLocation ( location: BoardLocation )
    {
        if ( ( location.x > 7 ) || ( location.x < 0 ) ) return -1;
        if ( ( location.y > 7 ) || ( location.y < 0 ) ) return -1;
        return this.board [location.y] [location.x];
    }
    /**
     * Checks a given location to see if a collapse would occur if a given
     * gem type was moved to it from that direction.
     * @param   {BoardLocation} location      The location to check
     * @param   {number}        gemType       The gem type number
     * @param   {string}        fromDirection The direction from which the gem would be moved, either 'up', 'down', 'left', or 'right'
     * @returns {boolean}       True if the gem move would trigger a collapse, false otherwise.
     */
    checkLocationForCollapse ( location: BoardLocation, gemType: number,
        fromDirection: string )
    {

        if ( this.checkLocation ( location ) == -1 ) return false;
        var copyLocation = location.copy ();

        var horizontalCount: number = 1;
        var verticalCount: number = 1;

        // check for vertical collapse
        if ( fromDirection != 'up' )
        {
            location = copyLocation.up ()
            while ( this.checkLocation ( location ) == gemType )
            {
                location = location.up ();
                ++verticalCount;
            }
        }
        if ( fromDirection != 'down' )
        {
            location = copyLocation.down ()
            while ( this.checkLocation ( location ) == gemType )
            {
                location = location.down ();
                ++verticalCount;
            }
        }
        if ( verticalCount >= 3 ) return true;
        if ( fromDirection != 'left' )
        {
            location = copyLocation.left ()
            while ( this.checkLocation ( location ) == gemType )
            {
                location = location.left ();
                ++horizontalCount;
            }
        }
        if ( fromDirection != 'right' )
        {
            location = copyLocation.right ()
            while ( this.checkLocation ( location ) == gemType )
            {
                location = location.right ();
                ++horizontalCount;
            }
        }
        if ( horizontalCount >= 3 ) return true;

        return false;
    }
    /**
     * Checks if the game board has possible moves or not.
     * @returns {boolean} True if the board has moves, otherwise false
     */
    hasMoves ()
    {

        for ( var i = 0; i < 8; ++i )
        {
            for ( var j = 0; j < 8; ++j )
            {

                var currentGemType = this.board [i] [j];
                var currentGemLocation = new BoardLocation ( j, i );

                if ( this.checkLocationForCollapse ( currentGemLocation.up (),
                    currentGemType, 'down' ) ) return true;
                if ( this.checkLocationForCollapse ( currentGemLocation.down (),
                    currentGemType, 'up' ) ) return true;
                if ( this.checkLocationForCollapse ( currentGemLocation.left (),
                    currentGemType, 'right' ) ) return true;
                if ( this.checkLocationForCollapse ( currentGemLocation.right (),
                    currentGemType, 'left' ) ) return true;
            }
        }

        return false;
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
