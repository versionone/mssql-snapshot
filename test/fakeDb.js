import sinon from 'sinon';
import sinonAsPromised from 'sinon-as-promised';

export default function() {
    return {
        connect: sinon.stub().resolves(null),
    };
}