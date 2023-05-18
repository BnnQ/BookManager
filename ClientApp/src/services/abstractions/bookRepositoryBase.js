export default class BookRepositoryBase {
    constructor(host, port, route, combinedBaseUrl) {
        this.host = host;
        this.port = port;
        this.route = route;
        this.combinedBaseUrl = combinedBaseUrl;
    }
}