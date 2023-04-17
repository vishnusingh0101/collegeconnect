const Expence = require('../model/expence');


// control to fetch all the expence details from database
exports.getAllExpence = (req, res, next) => {
    Expence.findAll()
    .then(expence => {
        res.json(expence);
    })
    .catch(err => console.log(err));
}

// control to save any expence detail in database
exports.postExpence = async (req, res, next) => {
    try{
        const data = await Expence.create({
             amount: req.body.amount,
             description: req.body.description,
             category: req.body.category
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
    console.log(expId, amount, description, category);
    console.log('Its in edit');
    Expence.findByPk(expId)
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
    Expence.destroy({where: {id: eId}})
    .then(expence => {
        console.log(expence);
        console.log('delete successs');
        res.sendStatus(200);
    })
    .catch(err => console.log(err));
}