/**
 * Class representing the score, total and by color.
 */
export class BejeweledScore {
    
    redScore: Number = 0;
    orangeScore: Number = 0;
    yellowScore: Number = 0;
    greenScore: Number = 0;
    blueScore: Number = 0;
    purpleScore: Number = 0;
    grayScore: Number = 0;
    totalScore: Number = 0;
    
    private recalculateTotal ()
    {
        this.totalScore += ( this.redScore + this.orangeScore + 
            this.yellowScore +
            this.greenScore + this.blueScore + this.purpleScore );
    }
    
    public update ( collapseRecord: any )
    {
        var consecutive = 1;
        var lastColor = 0;
        for ( var i = 0; i < collapseRecord.length; ++i )
        {
            var thisColor = collapseRecord [i] [2];
            if ( thisColor == lastColor ) ++consecutive;
            else 
            {
                consecutive = 1;
                lastColor = thisColor;
            }
            
            var amount = 1;
            if ( consecutive == 4 ) amount = 3;
            if ( consecutive == 5 ) amount = 6;
            
            switch ( thisColor )
            {
                case 1:
                    redScore += amount;
                    break;
                case 2:
                    
            }
        }
    }
};