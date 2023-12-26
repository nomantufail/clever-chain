// import _ from 'underscore';
class FileUploadService {

    /**
     * this method is responsible to convert a blob into a proper string
     * which can be displayed as an image.
     * @param blob
     */
    convertBlobToBase64(blob: string) {
        return Buffer.from(blob).toString('base64');
    }
}

const ocsService = new FileUploadService();
export default ocsService;
