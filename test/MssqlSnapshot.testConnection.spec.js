import 'babel-polyfill';
import { expect, before } from 'chai';
import sql from 'mssql';

import MssqlSnapshot from '../src/index';

describe("when testing the database connection", () => {
    it("config info must be supplied", function() {
        expect(MssqlSnapshot.testConnection).to.throw(/No configuration information supplied./);
    });
});