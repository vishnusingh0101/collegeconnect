const Expence = require('../model/expence');


// control to fetch all the expence details from database
exports.getAllExpence = (req, res, next) => {
    const id = req.user.id;
    Expence.findAll({where: {userId: id}})
    .then(expence => {
        res.json(expence);
    })
    .catch(err => console.log(err));
}

// control to save any expence detail in database
exports.addExpence = async (req, res, next) => {

    try{
        const data = await Expence.create({
             amount: req.body.amount,
             description: req.body.description,
             category: req.body.category,
             userId: req.user.id
        });
        res.status(200).json({newExpence: data});
    }catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    }
}

exports.postEditExpence = (req, res, next) => {
    const expId = req.body.id;
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    const uid = req.user.id;
    console.log(expId, amount, description, category);
    Expence.findOne({where: {userId: uid, id: expId}})
    .then(expence => {
      expence.amount = amount;
      expence.description = description;
      expence.category = category;
      res.status(200).json({newExpence: expence.dataValues});
      return expence.save();
    })
    .then(result => {
      console.log('updatedProduct');
    })
    .catch(err => console.log(err));
};

// control to delete any expence detail
exports.deleteExpence = (req, res, next) => {
    const eId = req.params.id;
    const uid = req.user.id;
    Expence.destroy({where: {userId: uid, id: eId}})
    .then(expence => {
        console.log(expence);
        console.log('delete successs');
        res.sendStatus(200);
    })
    .catch(err => console.log(err));
}