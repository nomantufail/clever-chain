export class FileReadingException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FileReadingException'
    }
}
