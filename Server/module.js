const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const randomNumber = require("random-number-csprng");

const mainModuleExports = module.exports = {};

// find module
mainModuleExports.customeModelFindById = (model, id, callback) => {
	model.findById(id, callback);
}
mainModuleExports.customeModelFindByIdSelect = (model, id, select, callback) => {
	model.findById(id).select(select).exec(callback)
}
mainModuleExports.customeModelFindByIdPopulate = (model, id, populateQuery, callback) => {
	model.findById(id).populate(populateQuery).exec(callback);
}
mainModuleExports.customeModelFindByIdLean = (model, id, callback) => {
	model.findById(id).lean().exec(callback);
}
mainModuleExports.customeModelFindByIdSelectPopulate = (model, id, select, populateQuery, callback) => {
	model.findById(id).select(select).populate(populateQuery).exec(callback)
}
mainModuleExports.customeModelFindByIdSelectLean = (model, id, select, callback) => {
	model.findById(id).select(select).lean().exec(callback)
}
mainModuleExports.customeModelFindByIdPopulateLean = (model, id, populateQuery, callback) => {
	model.findById(id).populate(populateQuery).lean().exec(callback);
}
mainModuleExports.customeModelFindByIdSelectPopulateLean = (model, id, select, populateQuery, callback) => {
	model.findById(id).select(select).populate(populateQuery).lean().exec(callback)
}

mainModuleExports.customeModelFindByQuery = (model, query, callback) => {
	model.find(query, callback);
}
mainModuleExports.customeModelFindByQuerySelect = (model, query, select, callback) => {
	model.find(query).select(select).exec(callback);
}
mainModuleExports.customeModelFindByQueryPopulate = (model, query, populateQuery, callback) => {
	model.find(query).populate(populateQuery).exec(callback);
}
mainModuleExports.customeModelFindByQueryLean = (model, query, callback) => {
	model.find(query).lean().exec(callback);
}
mainModuleExports.customeModelFindByQuerySelectPopulate = (model, query, select, populateQuery, callback) => {
	model.find(query).select(select).populate(populateQuery).exec(callback);
}
mainModuleExports.customeModelFindByQuerySelectLean = (model, query, select, callback) => {
	model.find(query).select(select).lean().exec(callback);
}
mainModuleExports.customeModelFindByQueryPopulateLean = (model, query, populateQuery, callback) => {
	model.find(query).populate(populateQuery).lean().exec(callback);
}
mainModuleExports.customeModelFindByQuerySelectPopulateLean = (model, query, select, populateQuery, callback) => {
	model.find(query).select(select).populate(populateQuery).lean().exec(callback);
}

mainModuleExports.customeModelFindOneByQuery = (model, query, callback) => {
	model.findOne(query, callback);	
}
mainModuleExports.customeModelFindOneByQueryPopulate = (model, query, populateQuery, callback) => {
	model.findOne(query).populate(populateQuery).exec(callback);
}

// create module
mainModuleExports.generalCreateDoc = (doc, callback) => {
	doc.save(callback);
}

// update module
mainModuleExports.customeModelUpdateById = (model, id, update, option, callback) => {
	model.findByIdAndUpdate(id, update, option, callback);
}
mainModuleExports.customeModelUpdateByIdPopulate = (model, id, update, option, populateQuery, callback) => {
	model.findByIdAndUpdate(id, update, option).populate(populateQuery).exec(callback);
}
mainModuleExports.customeModelUpdateByIdSelectAndPopulate = (model, id, update, option, select, populateQuery, callback) => {
	model.findByIdAndUpdate(id, update, option).select(select).populate(populateQuery).exec(callback);
}

mainModuleExports.customeModelUpdateByQuery = (model, query, update, option, callback) => {
	model.findOneAndUpdate(query, update, option, callback)
}

mainModuleExports.customeModelUpdateManyByQuery = (model, query, update, option, callback) => {
	model.updateMany(query, update, option, callback)
}



// delete module
mainModuleExports.customeModelDeleteById = (model, id, callback) => {
	model.findByIdAndRemove(id, callback);
}
mainModuleExports.customeModelDeleteByQuery = (model, query, callback) => {
	model.deleteMany(query, callback)
}
mainModuleExports.customeModelDeleteOneByQuery = (model, query, callback) => {
	model.findOneAndRemove(query, callback);
}


// aggregate module
mainModuleExports.customeModelAggregate = (model, aggregate, callback) => {
	model.aggregate(aggregate, callback)
}

// other module
mainModuleExports.generatePassHash = (doc, callback) => {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(doc.password, salt, (err, hash) => {
			if(err) return callback(err, null);
			doc.password = hash;
			callback(null, doc);
		});
	})
}
mainModuleExports.comparePassHash = function (pass, hash, callback){
  bcrypt.compare(pass, hash, function(err, ismatch) {
    if(err) throw err;
    callback(null, ismatch);
  });
}
mainModuleExports.generateRandonNum = (model, keyfind, retryTimes, callback) => {
  let cntr = 0;
  function run() {
    ++cntr;
  	randomNumber(1000, 9999, (err, num) => {
			if(err) callback(err);
			
			var query = {};
			query[keyfind] = num;
			
			model.findOne({$and: [query, {done: true}]}, (err, data) => {
				if(err) callback(err);

				if(data && new Date < data.kadaluarsa){
					if (cntr >= retryTimes) {
						callback("sudah dipakai");
					} else {
						run();
					}
				}else{
					callback(null, num);
				}
			});
		})
  }
  run();
}
