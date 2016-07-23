
export class BoardLocation {

    constructor ( public x: number, public y: number ) {}

    public copy () { return new BoardLocation ( this.y, this.x ); }
    public up () { return new BoardLocation ( this.y - 1, this.x ); }
    public down () { return new BoardLocation ( this.y + 1, this.x ); }
    public left () { return new BoardLocation ( this.y, this.x - 1 ); }
    public right () { return new BoardLocation ( this.y, this.x + 1 ); }

}
