var Model = require(gBase_dir + '/dal/models/models.module.js');
var BaseRepository = require(gBase_dir + '/dal/repos/base.js');

class DataContext  {

    constructor(){
        this._Logs = new BaseRepository(Model.Log);
        this._Users = new BaseRepository(Model.User);
        this._Containers = new BaseRepository(Model.Container);
    }

    get Logs(){
        return this._Logs;
    }

    get Users() {
        return this._Users;
    }

    get Containers() {
        return this._Containers;
    }
}

module.exports = new DataContext();