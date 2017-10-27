const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

chai.should();
should = chai.should;

chai.use(sinonChai);
chai.use(chaiAsPromised);
