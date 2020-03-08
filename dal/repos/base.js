//common database operations
//should be self explanatory
class BaseRepository 
{
    constructor(model) {
      this.model = model;
    }

    async findOne(params, projection, options, callback){
        return await this.model.findOne(params, projection, options, callback);
    }

    async find(params, projection, options, callback){
        return await this.model.find(params, projection, options, callback);
    }

    async findById(id, projection, options, callback){
        return await this.model.findById(id, projection, options, callback);
    }

    async findByIdAndRemove(id, projection, options, callback){
        return await object.findByIdAndRemove(id, projection, options, callback);
    }
    
    async exists(params, callback){
        return await object.exists(params);
    }

    async save(object){
        return await object.save();
    }
    
}

module.exports = BaseRepository;