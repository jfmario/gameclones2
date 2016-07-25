/**
 * Tests the BoardLocation class.
 * @file app/bejeweled/tests/board-location-test.ts
 * @see  app/bejeweled/models/board-location.ts
 */
 
import { BoardLocation } from '../models/board-location';

var bl = new BoardLocation ( 4, 4 );

describe ( 'AdjacencyTests', function ()
{
    it ( "isLeft() is adjacent to self" () => {
        expect ( bl.isAdjacent ( bl.left() ) ).toEqual ( true );
    });
});