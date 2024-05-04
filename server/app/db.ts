import { connect } from 'mongoose';

export class EstablishConnexion {
    uri = 'mongodb+srv://master:L3TM31NPLS@cluster1.eyfnfs1.mongodb.net/?retryWrites=true&w=majority';
    connectionToDB() {
        connect(this.uri);
    }
}
