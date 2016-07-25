
export class BoardLocation {

    constructor ( public x: number, public y: number ) {}

    public copy () { return new BoardLocation ( this.y, this.x ); }
    public isAdjacent ( otherLocation: BoardLocation ): boolean
    {

        if ( ( Math.abs ( this.x - otherLocation.x ) == 1 ) &&
            ( this.y == otherLocation.y ) ) return true;
        if ( ( Math.abs ( this.y - otherLocation.y ) == 1 ) &&
            ( this.x == otherLocation.x ) ) return true;

        return false;
    }
    public isEqual ( otherLocation: BoardLocation ): boolean
    {
        return ( ( this.x == otherLocation.x ) && ( this.y == otherLocation.y ) );
    }
    public up () { return new BoardLocation ( this.y - 1, this.x ); }
    public down () { return new BoardLocation ( this.y + 1, this.x ); }
    public left () { return new BoardLocation ( this.y, this.x - 1 ); }
    public right () { return new BoardLocation ( this.y, this.x + 1 ); }

}
